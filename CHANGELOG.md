# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-10-26

### Fixed
- **Select Card ID**: Fixed `selectCard()` method returning wrong card ID.

## [1.0.2] - 2025-10-26

### Changed
- Improved documentation in README.md with prerequisites for driver installation
- Added troubleshooting notes for device not responding (try different baudrates)
- Added "Tested Devices" section to track compatible hardware
- Updated README with comprehensive usage and development guide

### Added
- Added note in Quick Start about changing baudrate if device doesn't respond
- Added detailed driver installation instructions for Windows, Linux, and macOS

## [1.0.1] - Previous Release

### Added
- Initial release with basic MIFARE card reader functionality

## [1.0.0] - Initial Release

### Added
- Core `MifareReader` class implementation
- Serial port communication support
- Card detection and selection (`selectCard`)
- Card authentication (`authen`)
- Card data reading (`readCard`)
- LED color control (`changeLedColor`)
- Audio beep functionality (`beep`)
- Support for both CommonJS and ES Modules
- Full TypeScript type definitions
- Retry logic for initialization
- Configurable timeout handling
- Support for multiple baud rates (9600, 19200, 57600, 115200)
- Key mode support (A and B)
- Example test files demonstrating usage

---

## Types of Changes

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes
