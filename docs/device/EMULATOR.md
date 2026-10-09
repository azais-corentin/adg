# Android emulator captures

Decision D13: we screenshot stages the player hasn't reached by running the **real Android 3.18.0 app in a local emulator** and loading a save from that stage. The phone's own save is never touched. The APK comes from the phone (read-only) and stays outside the repo.

```sh
bun run device:emulator                     # create AVD if missing, boot headless, install the APK
bun run device:load fixtures/saves/community/ra.txt
bun run device:capture ra                   # → static/screens/ra/<tab>-<subtab>-<page>.webp
```

Requirements: x86_64 Linux with `/dev/kvm`, and the repo's Nix devShell (direnv). The default shell provides `adb` (android-tools), `cwebp` (libwebp) and `tesseract` (English only). The Android SDK, emulator and system image are flake package `.#android-sdk`. That package uses a separate nixpkgs instance with `allowUnfree` and `android_sdk.accept_license`, so the rest of the flake stays free. `device:emulator` builds it on first use (about 2 GB). `nix develop .#android` gives a shell with `ANDROID_HOME` set, which is optional.

## Commands

| Command                                             | What it does                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bun run device:pull-apk <phone serial>`            | One-time. Copies the installed APK splits from the phone into `~/.cache/adg/apk/3.18.0/` after checking versionCode 30180000. Runs only `dumpsys package`, `pm path` and `adb pull`.                                                                                                                |
| `bun run device:emulator [--restart] [--reinstall]` | Builds `.#android-sdk` if needed. Writes the AVD if missing and boots it headless (`-no-window -no-audio -no-boot-anim`, SwiftShader GPU, gRPC on). Waits for `sys.boot_completed`, prepares the device (below) and runs `adb install-multiple` with all splits unless 3.18.0 is already installed. |
| `bun run device:load <save.txt>`                    | Imports a save: Options → Save & Load → **Import save**, pastes from the clipboard, checks the summary, presses **Confirm**, and waits for the main screen. Accepts web/Steam (`…SavefileFormatAAB…`), Android (`…AndroidSaveFormatAAA…`) and legacy pre-Reality (`eyJ…`) saves.                    |
| `bun run device:capture <stage>[/<variant>] [tab…]` | Screenshots every tab, subtab and scroll page into `static/screens/<stage>/`. `<stage>` must be an id from `src/lib/stages.ts`. Optional tab names limit the run, e.g. `device:capture ra celestials`. A `/<variant>` suffix writes to `static/screens/<stage>/<variant>/` for a second state of the same stage, e.g. `device:capture pre-infinity/new-game dimensions` after `adb shell pm clear` and **Start game**. |
| `bun run device:export <out.txt>`                   | Presses Options → **Export to web/steam** and writes the clipboard to `<out.txt>`. This is how the legacy community saves were turned into web/Steam strings.                                                                                                                                       |
| `bun scripts/device/inject-automator.ts <save.txt> <script-id> [--run]` | Test helper for Automator scripts: replaces every script in the save with one library script (`src/lib/tools/automator/scripts/<script-id>.txt`), selects it, and with `--run` arms mode RUN with the stack on its first command so it starts on load. `device:load` the result, then watch the Automator tab or `device:export` and diff the save. |

Stop the emulator with `adb -s emulator-5584 emu kill`. That saves a quick-boot snapshot.

**Several emulators:** every command honours `ADG_EMULATOR_PORT` (default `5584`; serial `emulator-<port>`, gRPC on `<port>+3000`). A running emulator locks its AVD, so each port gets its own AVD (`adg-pixel9pro-api35-<port>`). Example: `ADG_EMULATOR_PORT=5590 bun run device:emulator`.

## Device and image

| Item         | Value                                                                                                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| APK          | `base.apk` (77 MB), `split_config.arm64_v8a.apk`, `split_config.xxhdpi.apk`. minSdk 32, targetSdk/compileSdk 37 (Android 17). `requiredSplitTypes="base__abi,base__density"`, so all three splits must be installed together.                                                  |
| ABIs         | The game is JVM bytecode: `base.apk` has **no `lib/`**. The only native code is two AndroidX helpers in the arm64 split (`libandroidx.graphics.path.so`, `libdatastore_shared_counter.so`). No Play licence check (no pairip). Only the `com.android.stamp` source stamp.      |
| System image | `system-images;android-35;google_apis;x86_64`. It lists `ro.system.product.cpu.abilist=x86_64,arm64-v8a` and ships `libndk_translation.so` (ARM native bridge), so the arm64 split installs and runs on KVM-accelerated x86_64. Emulator 37.1.11.                              |
| AVD          | `adg-pixel9pro-api35` in `~/.cache/adg/avd/` (written by hand, no `avdmanager`/JDK). **960×2142 at 360 dpi**, from the phone's `wm size` / `wm density` (Pixel 9 Pro), so screenshots have the phone's size and layout. 4 GB RAM, 4 cores, 6 GB data partition, no Play Store. |
| Boot         | Cold boot **28.7 s** on an idle machine (first boot after AVD creation). 39 s for a second instance while the first was capturing. APK install about 10 s.                                                                                                                     |

`device:emulator` also prepares the device on every run:

- turns off window/transition/animator animations;
- keeps the screen on;
- marks the "Viewing full screen" hint as already seen;
- disables every input method (Gboard and the voice IME would cover dialogs);
- makes sure the gRPC endpoint is up.

## How `device:load` works

1. Decodes the save and sets `lastUpdate` to now, then re-encodes it in the same envelope. Without this, the game simulates the time since the save was made. That can be years for community saves, and autobuyers would carry the save to a different stage. **SKIP** on the "Calculating offline progress" screen does not prevent this: it still applies the whole away time in bigger ticks.
2. Starts the app and reaches the main screen. It taps **Start game** on the loading screen and closes dialogs. Informational dialogs (changelog, "Cloud saving", "While you were away") are closed with CONFIRM. Any dialog with a CANCEL button is cancelled, so a leftover import or prestige confirmation is never accepted.
3. Opens Options (always the third icon from the right), scrolls until OCR finds **Import save**, and taps it.
4. Puts the save on the emulator clipboard through the emulator's gRPC API. It then selects all, deletes, and sends `KEYCODE_PASTE`. The dialog already shows the previous clipboard. `adb shell input text` was far too slow for 10–20 kB strings, and the field re-validates on every keystroke.
5. Reads the dialog by OCR. It fails on "Invalid save". Otherwise it prints the summary (antimatter, IP, EP, RM, save time), presses **CONFIRM** and waits for the main screen again.

## How `device:capture` works

- **Tabs:** it finds the bottom-navigation icons by scanning the icon row for lit columns. Their order is fixed: Dimensions, then the unlocked ones of Autobuyers, Challenges, Infinity, Eternity, Reality, Celestials, then Achievements, Statistics, Options, Shop, Info. That gives the tab names (`dimensions`, `autobuyers`, …, `celestials`, …). A sanity check aborts if Dimensions/Statistics/Options don't open the expected first subtab. That would happen if a save hides tabs with _Modify visible tabs_.
- **Subtabs:** OCR of the label bar. Words less than 22 px apart form one label ("Past Runs", "Glyph Sets", "How to play"). The file name uses the lowercased label without spaces (`pastruns`, `blackhole`). A tab with a single label is `main` (`options-main`, `shop-main`, `autobuyers-main`). Off-screen labels are reached by dragging the bar.
- **Pages:** each page starts at the top (flings until nothing moves). Drags are 1000 px, about 650 px of overlap, and run along the **left screen edge (x = 5)**, where no game control lives. The script holds still before lifting, so the list doesn't fling. It stops when a drag moves the content by less than 24 px. Movement is measured by aligning per-row brightness profiles, so ticking numbers don't count as scrolling. A page that doesn't scroll is saved as `top`; otherwise `0`, `1`, …. Old files with the same `<tab>-<subtab>-` prefix are replaced.
- **Never tapped:** the floating prestige buttons (Eternity, B.Crunch, D.Boost, A.Galaxy, R.Galaxy, Max), upgrades and Time Study nodes. The script only taps navigation icons, subtab labels and dialog CONFIRM/CANCEL buttons.
- **Time Studies:** holding a study buys it, so the tree is never dragged. The script drags from just above the "Zoom:" row up to the top. A scroll keeps the finger on the same content point, so it only touches the header. That gives page `1` with the tree; the reverse drag restores the page. The Perk tree (`reality-perks`) pans instead of scrolling and is captured as `top` only.
- WebP quality 82 via `cwebp` (raw `screencap` → PPM → WebP). 100–150 kB per screen.

## Gotchas

- **uiautomator is useless here:** the app animates constantly, and dumps include hidden views. Everything is located from screenshots: OCR (tesseract `--psm 11`) for text, pixel scans for icons and dialogs. Dialogs are a flat `(34, 34, 34)` panel over a dimmed screen.
- **The game keeps running** while it is captured. Numbers tick, and autobuyers may prestige between pages: the Ra save Eternities by itself. Screens show a live game a few seconds to minutes after the save, not a frozen state.
- **gRPC is not on by default.** The emulator only advertises it, with a bearer token, in `$XDG_RUNTIME_DIR/avd/running/pid_<pid>.ini` when started with `-grpc` (or after `adb emu grpc <port>`). `device:emulator` handles both cases.
- **One adb server for phone and emulator.** Use the devShell's `adb` everywhere. The SDK's `platform-tools/adb` in `nix develop .#android` is a different version and restarts the server, which drops the phone's wireless connection. The scripts always pass `-s emulator-<port>`, and nothing in `scripts/device/` except `pull-apk` addresses the phone.
- **Legacy saves import fine.** Android 3.18.0 accepts pre-Reality `eyJ…` saves (version 12.x) in Import save and migrates them. `device:export` then yields a current web/Steam string (version 25).
- OCR misread the single-letter Celestial subtab "V" as "Vv". `capture.ts` has a small alias table (`OCR_FIXES`).
- Fresh installs show a changelog and a "Cloud saving" dialog after the first import. `device:load` closes both.
- `device:capture` takes about 10 minutes for a late-game save (12 tabs, ~100 screens), mostly OCR and scroll settling.
