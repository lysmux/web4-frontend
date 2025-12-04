<script lang="ts">
	let { children } = $props();
</script>

<div>
	{@render children()}
</div>

<style lang="scss">
  div {
    color: white;
    font-size: 1.2em;
    font-weight: 700;
    text-align: center;
  }
</style>