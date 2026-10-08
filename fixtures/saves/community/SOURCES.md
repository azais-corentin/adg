# Community saves

Later-stage saves for loading into the emulator (`bun run device:load fixtures/saves/community/<file>`, see `docs/device/EMULATOR.md`).
All of them come from **AD Save Bank** by Buck4437: <https://github.com/Buck4437/save-bank> (site: <https://buck4437.github.io/save-bank/>), **MIT License**, pinned at commit [`60b77a0`](https://github.com/Buck4437/save-bank/tree/60b77a00b1901a8345f450cf1896c5ab51b104f6) (2026-05-31). Retrieved 2026-10-08.
Each file holds the save's `data` string exactly as published, with no trailing newline.

The bank's README credits the original save archive by earthernsence and its donors (Hira, Lars, GSUI5051, Alex9127, and others). The pre-Reality saves carry no per-save donor.

File names are stage ids from `src/lib/stages.ts`. The exception is `early-reality-first.txt`, which is a second `early-reality` save taken right after the first Reality.

| File | Source (file and save name in the bank) | What it shows |
| ---- | ---------------------------------------- | ------------- |
| `eternity-challenges.txt` | [`src/eternity-challenge.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/eternity-challenge.js): "1e27 EP/219 TT" | Eternity Challenges in progress: EC1×5, EC2×4, EC3×5, EC4–6×3, EC7×2, EC8×1; 1e27 EP, 219 Time Theorems. Pre-Reality legacy save (plain base64 JSON, `version` 12.1). |
| `early-dilation.txt` | [`src/time-dilation-dilation.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/time-dilation-dilation.js): "e1347 EP/3e3 TP" | Time Dilation unlocked and run: all dilation upgrades up to 1e7 Dilated Time; e1347 EP, 3e3 Tachyon Particles. Legacy save (`version` 12.3). |
| `late-eternity.txt` | [`src/time-dilation-dilation.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/time-dilation-dilation.js): "e3451 EP" | Late Eternity: all dilation upgrades, Time Dimensions 5–8 unlocked and bought; e3451 EP. Legacy save (`version` 12.3). |
| `early-reality-first.txt` | [`src/reality.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/reality.js): "1 Reality/Pre-Infinity/2 RM" (donor: Buck) | Right after the first Reality: 1 Reality, 2 RM, back in Pre-Infinity. |
| `early-reality.txt` | [`src/reality.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/reality.js): "6 Realities" (donor: Buck) | 6 Realities, Black Hole unlocked. |
| `teresa.txt` | [`src/celestial-1.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/celestial-1.js): "1e14 RM" (donor: Buck) | Teresa (Celestial 1) Reality completed; 1e14 RM, 426 Realities. |
| `effarig.txt` | [`src/celestial-1.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/celestial-1.js): "1e27 RM" (donor: Buck) | Effarig (Celestial 2) layer 1 completed; 1e27 RM. |
| `nameless.txt` | [`src/celestial-3.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/celestial-3.js): "1e51 RM" (donor: GSUI5051) | The Nameless Ones (Celestial 3) Reality completed; 1e51 RM. Offline progress is off in this save. |
| `v.txt` | [`src/celestial-3.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/celestial-3.js): "1e74 RM/15 V" (donor: Buck) | V (Celestial 4): 15 V-achievements, 1e74 RM. |
| `ra.txt` | [`src/celestial-5.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/celestial-5.js): "1e280 RM" (donor: Buck) | Ra (Celestial 5): Celestial memory levels 16/12/11/7, 1e280 RM. |
| `imaginary-machines.txt` | [`src/imaginary.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/imaginary.js): "1e8 iM" (donor: Buck) | Imaginary Machines: 1e8 iM; Ra completed, *Suspicion of Interference* bought. |
| `laitela.txt` | [`src/imaginary.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/imaginary.js): "1e10 iM" (donor: Buck) | Lai'tela (Celestial 6) destabilized ×4, 4th Dark Matter Dimension unlocked; 1e10 iM. |
| `pelle.txt` | [`src/celestial-7-eternity-challenge.js`](https://github.com/Buck4437/save-bank/blob/60b77a00b1901a8345f450cf1896c5ab51b104f6/src/celestial-7-eternity-challenge.js): "8e6 Remnants/1750 TT" (donor: Buck) | Pelle (Celestial 7, Doomed): 8e6 Remnants, 1750 TT, EC1–9×5, EC10×1. |

Formats: the three pre-Reality saves are the legacy plain-base64 JSON (`eyJ…`), which Android 3.18.0 accepts in **Import save** (verified in the emulator). The others are web/Steam `AntimatterDimensionsSavefileFormatAAB…EndOfSavefile` strings.

## License

```text
MIT License

Copyright (c) 2022 Buck4437

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
