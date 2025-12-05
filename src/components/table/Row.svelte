<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet
	}

	const { children }: Props = $props();
</script>

<tr>{@render children()}</tr>

<style lang="scss">
  @media (max-width: 1000px) {
    tr {
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      border-radius: 10px;
    }
  }

  @media (max-width: 600px) {
    tr {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>