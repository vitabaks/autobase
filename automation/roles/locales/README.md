# Ansible Role: locales

Generates system locales and sets the default locale on target hosts. Updates locale settings in /etc/default/locale or /etc/locale.conf, /etc/environment.

On Debian it uses `community.general.locale_gen` to enable locales; on RedHat it installs `glibc-langpack` packages.

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| locale_gen | [{ language_country: "en_US", encoding: "UTF-8" }] | List of locales to generate (Debian uses community.general.locale_gen; RedHat installs corresponding langpacks). Empty list skips generation. |
| locale | "en_US.UTF-8" | System locale to set (LANG/LC_ALL). Empty string skips configuration. |
| glibc_langpack | ["glibc-langpack-en"] | RedHat-only: packages required to enable selected languages. |

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
