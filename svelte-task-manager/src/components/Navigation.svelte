<script>
	import { page } from '$app/stores';
	import { taskStats } from '$lib/stores/tasks';
	import { fade, slide } from 'svelte/transition';

	// Mobile menu state
	let mobileMenuOpen = false;

	// active path
	const isActive = (path) => {
		if (path === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(path);
	};

	// Toggle mobile menu
	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
	};

	// Close mobile menu
	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};

	// Handle navigation click
	const handleNavClick = () => {
		closeMobileMenu();
	};
</script>

<nav class="navigation" aria-label="Main navigation">
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/" class="brand-link" onclick={handleNavClick}>
				<svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M9 11l3 3L22 4"></path>
					<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
				</svg>
				<span class="brand-text">TaskManager</span>
			</a>

			{#if $taskStats.total > 0}
				<div class="stats-badge desktop-only">
					<span class="stats-text">{$taskStats.completed}/{$taskStats.total}</span>
				</div>
			{/if}
		</div>

		<div class="nav-links desktop-only">
			<a
				href="/"
				class="nav-link {isActive('/') ? 'active' : ''}"
				aria-current={isActive('/') ? 'page' : undefined}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
					<polyline points="9 22 9 12 15 12 15 22"></polyline>
				</svg>
				<span>Home</span>
				{#if $taskStats.pending > 0 && isActive('/')}
					<span class="badge">{$taskStats.pending}</span>
				{/if}
			</a>

			<a
				href="/about"
				class="nav-link {isActive('/about') ? 'active' : ''}"
				aria-current={isActive('/about') ? 'page' : undefined}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="16" x2="12" y2="12"></line>
					<line x1="12" y1="8" x2="12.01" y2="8"></line>
				</svg>
				<span>About</span>
			</a>
		</div>

		<button
			class="mobile-menu-btn mobile-only"
			onclick={toggleMobileMenu}
			aria-expanded={mobileMenuOpen}
			aria-label="Toggle navigation menu"
		>
			{#if mobileMenuOpen}
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			{:else}
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
			{/if}
		</button>
	</div>

	{#if mobileMenuOpen}
		<div class="mobile-menu mobile-only" transition:slide={{ duration: 300 }}>
			<div class="mobile-menu-content">
				{#if $taskStats.total > 0}
					<div class="mobile-stats">
						<div class="stat-item">
							<span class="stat-label">Total</span>
							<span class="stat-value">{$taskStats.total}</span>
						</div>
						<div class="stat-item">
							<span class="stat-label">Pending</span>
							<span class="stat-value pending">{$taskStats.pending}</span>
						</div>
						<div class="stat-item">
							<span class="stat-label">Done</span>
							<span class="stat-value completed">{$taskStats.completed}</span>
						</div>
					</div>
				{/if}

				<div class="mobile-nav-links">
					<a
						href="/"
						class="mobile-nav-link {isActive('/') ? 'active' : ''}"
						onclick={handleNavClick}
						aria-current={isActive('/') ? 'page' : undefined}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
							<polyline points="9 22 9 12 15 12 15 22"></polyline>
						</svg>
						<span>Home</span>
						{#if $taskStats.pending > 0}
							<span class="badge">{$taskStats.pending}</span>
						{/if}
					</a>

					<a
						href="/about"
						class="mobile-nav-link {isActive('/about') ? 'active' : ''}"
						onclick={handleNavClick}
						aria-current={isActive('/about') ? 'page' : undefined}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="16" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12.01" y2="8"></line>
						</svg>
						<span>About</span>
					</a>
				</div>
			</div>
		</div>
	{/if}
</nav>

{#if mobileMenuOpen}
	<div
		class="mobile-menu-backdrop mobile-only"
		onclick={closeMobileMenu}
		transition:fade={{ duration: 200 }}
		role="button"
		tabindex="-1"
		aria-label="Close menu"
	></div>
{/if}

<style>
	.navigation {
		background: white;
		border-bottom: 1px solid #e5e7eb;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.nav-container {
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}

	/* Brand/Logo */
	.nav-brand {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.brand-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: #8b5cf6;
		font-weight: 700;
		font-size: 1.25rem;
		transition: opacity 0.2s;
	}

	.brand-link:hover {
		opacity: 0.8;
	}

	.brand-text {
		color: #1f2937;
	}

	.stats-badge {
		display: flex;
		align-items: center;
		padding: 0.375rem 0.75rem;
		background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
		color: white;
		border-radius: 20px;
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		border-radius: 6px;
		text-decoration: none;
		color: #6b7280;
		font-weight: 500;
		font-size: 0.9375rem;
		transition: all 0.2s;
		position: relative;
	}

	.nav-link:hover {
		background: #f3f4f6;
		color: #8b5cf6;
	}

	.nav-link.active {
		color: #8b5cf6;
		background: #f3f0ff;
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background: #8b5cf6;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 0.375rem;
		background: #ef4444;
		color: white;
		border-radius: 10px;
		font-size: 0.6875rem;
		font-weight: 700;
	}

	.mobile-menu-btn {
		display: none;
		padding: 0.5rem;
		border: none;
		background: transparent;
		color: #6b7280;
		cursor: pointer;
		border-radius: 6px;
		transition: background-color 0.2s;
	}

	.mobile-menu-btn:hover {
		background: #f3f4f6;
	}

	.mobile-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.mobile-menu-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.mobile-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 8px;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.stat-value.pending {
		color: #3b82f6;
	}

	.stat-value.completed {
		color: #10b981;
	}

	.mobile-nav-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mobile-nav-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: #6b7280;
		font-weight: 500;
		transition: all 0.2s;
	}

	.mobile-nav-link:hover {
		background: #f3f4f6;
	}

	.mobile-nav-link.active {
		background: #f3f0ff;
		color: #8b5cf6;
	}

	.mobile-menu-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 90;
	}

	.desktop-only {
		display: flex;
	}

	.mobile-only {
		display: none;
	}

	@media (max-width: 768px) {
		.desktop-only {
			display: none;
		}

		.mobile-only {
			display: block;
		}

		.mobile-menu-btn {
			display: flex;
		}
	}

	.nav-link:focus-visible,
	.mobile-nav-link:focus-visible,
	.mobile-menu-btn:focus-visible {
		outline: 2px solid #8b5cf6;
		outline-offset: 2px;
	}
</style>
