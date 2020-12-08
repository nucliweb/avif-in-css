/**
 * @jest-environment jsdom
 */
const postcss = require('postcss')

const plugin = require('..')

function run(input, output, options) {
  expect(postcss([plugin(options)]).process(input).css).toBe(output)
}

it('adds classes and AVIF link', () => {
  run(
    '@media screen { a, b { color: black; background: url(./image.jpg) } }',
    '@media screen { ' +
      'a, b { color: black } ' +
      'body.no-avif a, body.no-avif b { background: url(./image.jpg) } ' +
      'body.avif a, body.avif b { background: url(./image.avif) } ' +
      '}'
  )
})

it('should work with jpeg, png', () => {
  run(
    '@media screen { a, b { color: black; background: url(./image.jpeg) } }',
    '@media screen { ' +
      'a, b { color: black } ' +
      'body.no-avif a, body.no-avif b { background: url(./image.jpeg) } ' +
      'body.avif a, body.avif b { background: url(./image.avif) } ' +
      '}'
  )
})

it('should skip urls with [&?]format=avif', () => {
  run(
    '@media screen { a, b { color: black; background: url(./image.jpeg?format=avif) } }',
    '@media screen { a, b { color: black; background: url(./image.jpeg?format=avif) } }'
  )
})

it('removes empty rule', () => {
  run(
    'a,b { background: url(./image.PNG) }',
    'body.no-avif a,body.no-avif b { background: url(./image.PNG) }' +
      'body.avif a,body.avif b { background: url(./image.avif) }'
  )
})

it('does not dublicate html tag', () => {
  run(
    'html[lang=en] .icon { background: url(./image.jpg) }',
    'html[lang=en] body.no-avif .icon { background: url(./image.jpg) }' +
      'html[lang=en] body.avif .icon { background: url(./image.avif) }'
  )
})

describe('options', () => {
  it('should add :global() scope when css modules enabled', () => {
    run(
      'a { background: url(./image.png) }',
      'body:global(.no-avif) a { background: url(./image.png) }' +
        'body:global(.avif) a { background: url(./image.avif) }',
      {modules: true}
    )
  })

  it('should use passed classNames', () => {
    run(
      '.c { background: url(./image.png) }',
      'body.without-avif .c { background: url(./image.png) }' +
        'body.has-avif .c { background: url(./image.avif) }',
      {noAvifClass: 'without-avif', avifClass: 'has-avif'}
    )
  })

  it('set rename function', () => {
    run(
      '.c { background: url(./image.png) }',
      'body.no-avif .c { background: url(./image.png) }' +
        'body.avif .c { background: url(./image.png.avif) }',
      {
        rename: oldName => {
          return oldName.replace(/\.(jpg|png)/gi, '.$1.avif')
        }
      }
    )
  })
})
