# Changelog

## 5.4.0

- **Feature:**
  - Update `dctl contract rm` to support an optional transaction type (like `dctl contract get`)
  - Add `dctl interchain publish` to support publishing a signed transaction on a Dragonchain interchain network
- **Development:**
  - Update dependencies

## 5.3.1

- **Bugs:**
  - Update Dragonchain mock webserver to fix bugs resolved in dragonchain
- **Development:**
  - Update dependencies

## 5.3.0

- **Feature:**
  - Add `dctl transaction eternal <transactionId>` to get eternal proof report for a transaction

## 5.2.0

- **Feature:**
  - Add support for api key permissioning
- **Development:**
  - Update dependencies

## 5.1.2

- **Bugfix:**
  - fixes binance chain create and update network flags

## 5.1.1

- **Bugfix:**
  - fixes heap data being written incorrectly when testing smartcontracts
  - fixes error thrown when no secrets are present

## 5.1.0

- **Feature:**
  - Add binance commands

## 5.0.0

- **Feature:**
  - Add new commands `dctl creds remote rm`, `dctl creds remote ls`
  - Remove nonsensical command `dctl creds default rm`
  - Seperate credentials commands into two logical partitions, `dctl creds local` and `dctl creds remote`
- **Development:**
  - Beginning of CHANGELOG
