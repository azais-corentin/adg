{
  description = "adg - interactive guide for Antimatter Dimensions (Android)";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});

      # Android emulator for capturing app screenshots (docs/device/EMULATOR.md). The SDK and
      # system images are unfree, so they come from a separate nixpkgs instance; the rest of the
      # flake stays free-only. x86_64-linux only (KVM-accelerated x86_64 image; the app's two
      # arm64 helper libraries run through the image's ARM native bridge).
      androidPkgs = import nixpkgs {
        system = "x86_64-linux";
        config = {
          allowUnfree = true;
          android_sdk.accept_license = true;
        };
      };
      androidSdk =
        (androidPkgs.androidenv.composeAndroidPackages {
          platformVersions = [ "35" ];
          includeEmulator = true;
          includeSystemImages = true;
          systemImageTypes = [ "google_apis" ];
          abiVersions = [ "x86_64" ];
          includeCmake = false;
          includeNDK = false;
        }).androidsdk;
    in
    {
      packages.x86_64-linux.android-sdk = androidSdk;

      devShells = forAllSystems (
        pkgs:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              bun
              # SvelteKit 3 / Vite 8 tooling requires Node >= 22.17.
              nodejs_22
              # Cloudflare Pages deploys; the nixpkgs build ships a patched workerd.
              wrangler
              # Wireless adb (mDNS pairing) for capturing Android screenshots and saves.
              android-tools
              playwright-driver.browsers
              # cwebp + tesseract: emulator screenshots are stored as WebP, and the capture
              # scripts locate buttons by OCR (scripts/device/).
              libwebp
              (tesseract.override { enableLanguages = [ "eng" ]; })
            ];

            shellHook = ''
              export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
              export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
            '';
          };
        }
        // nixpkgs.lib.optionalAttrs (pkgs.stdenv.hostPlatform.system == "x86_64-linux") {
          # `nix develop .#android`: the default shell plus the Android SDK and emulator.
          # `bun run device:emulator` builds `.#android-sdk` itself, so this shell is optional.
          android = androidPkgs.mkShell {
            inputsFrom = [ self.devShells.x86_64-linux.default ];
            packages = [ androidSdk ];
            shellHook = self.devShells.x86_64-linux.default.shellHook + ''
              export ANDROID_HOME=${androidSdk}/libexec/android-sdk
              export ANDROID_SDK_ROOT=$ANDROID_HOME
            '';
          };
        }
      );

      formatter = forAllSystems (pkgs: pkgs.nixfmt-rfc-style);
    };
}
