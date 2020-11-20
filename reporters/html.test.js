const MockDate = require('mockdate')

MockDate.set(new Date('2020-10-25T17:35:35'))
jest.mock('temp-write', () => jest.fn().mockImplementation(() => '/temp/path'))
jest.mock('open', () => jest.fn())

const {report} = require('./html')

const tempWrite = require('temp-write')
const open = require('open')

afterAll(() => {
  MockDate.reset()
})

test('html report', async () => {
  await report({
    sections: [
      [
        'Done',
        [
          {
            html_url: 'https://github.com/org/repo/pull/35',
            title: 'feat: feature 1',
          },
          {
            html_url: 'https://github.com/org/repo/pull/135',
            title: 'fix: critical bug',
          },
        ],
      ],
      [
        'WIP',
        [
          {
            html_url: 'https://github.com/org/repo/pull/5',
            title: 'feat: huge feature in progress',
          },
          {
            html_url: 'https://github.com/org/repo/pull/235',
            title: 'fix: low priority bug',
          },
        ],
      ],
    ],
    source: {forDays: 7},
  })
  expect(tempWrite).toHaveBeenCalledWith(expect.anything(), 'report.html')
  expect(tempWrite.mock.calls[0][0]).toMatchSnapshot()
  expect(open).toHaveBeenCalledWith('/temp/path')
})
