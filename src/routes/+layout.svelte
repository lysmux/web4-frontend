<script lang="ts">
	import '../app.scss';

	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.ico';

	import { FlatToast, ToastContainer } from 'svelte-toasts';
	import Header from '../components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Веб 4</title>
</svelte:head>

<div class="container">
	{#if !page.url.pathname.startsWith('/auth')}
		<Header />
	{/if}

	<ToastContainer let:data={data}>
		<FlatToast {data} />
	</ToastContainer>

	<main>
		{@render children()}
	</main>
</div>

<style lang="scss">
  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    width: 95%;
    margin-inline: auto;
    margin-block: 20px;

    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>