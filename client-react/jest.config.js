module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', 
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', 
  },
  testEnvironment: 'jsdom',
};