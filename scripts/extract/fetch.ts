/**
 * Shallow-fetches the pinned upstream commit into `vendor/ad-source/`.
 * Idempotent: a checkout already at the pin with a clean tree is left untouched.
 */
import { existsSync, mkdirSync } from 'node:fs';
import { UPSTREAM, VENDOR_DIR } from './pin';

function git(args: string[], cwd = VENDOR_DIR): string {
	const result = Bun.spawnSync(['git', ...args], { cwd, stdout: 'pipe', stderr: 'pipe' });
	if (result.exitCode !== 0) {
		throw new Error(`git ${args.join(' ')} failed:\n${result.stderr.toString()}`);
	}
	return result.stdout.toString().trim();
}

function isPinnedAndClean(): boolean {
	if (!existsSync(`${VENDOR_DIR}/.git`)) return false;
	try {
		return git(['rev-parse', 'HEAD']) === UPSTREAM.sha && git(['status', '--porcelain']) === '';
	} catch {
		return false;
	}
}

export function ensureUpstream(): void {
	if (isPinnedAndClean()) return;
	mkdirSync(VENDOR_DIR, { recursive: true });
	if (!existsSync(`${VENDOR_DIR}/.git`)) git(['init', '--quiet']);
	const remotes = git(['remote']).split('\n');
	if (remotes.includes('origin')) git(['remote', 'set-url', 'origin', UPSTREAM.url]);
	else git(['remote', 'add', 'origin', UPSTREAM.url]);
	git(['fetch', '--quiet', '--depth', '1', 'origin', UPSTREAM.sha]);
	git(['checkout', '--quiet', '--force', '--detach', 'FETCH_HEAD']);
	git(['clean', '--quiet', '-fdx']);
	const head = git(['rev-parse', 'HEAD']);
	if (head !== UPSTREAM.sha) {
		throw new Error(`vendor checkout is at ${head}, expected pinned ${UPSTREAM.sha}`);
	}
}

if (import.meta.main) {
	ensureUpstream();
	console.log(`vendor/ad-source at ${UPSTREAM.sha}`);
}
