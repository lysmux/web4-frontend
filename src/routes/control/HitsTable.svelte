<script lang="ts">
	import Pagination from '../../components/table/Pagination.svelte';
	import Row from '../../components/table/Row.svelte';
	import Cell from '../../components/table/Cell.svelte';
	import Table from '../../components/table/Table.svelte';
	import type { HitResult } from '$lib/api/hit.ts';

	interface Props {
		data: HitResult[];
		currentPage: number;
		lastPage: number;
	}

	let {
		data,
		currentPage = $bindable(),
		lastPage
	}: Props = $props();
</script>

<Table>
	{#snippet head()}
		<Row>
			<Cell>Время</Cell>
			<Cell>X</Cell>
			<Cell>Y</Cell>
			<Cell>R</Cell>
			<Cell>Попадание</Cell>
			<Cell>Время выполнения</Cell>
		</Row>
	{/snippet}

	{#snippet body()}
		{#each data as result (result.id)}
			<Row>
				<Cell>{new Date(result.createdAt).toLocaleTimeString()}</Cell>
				<Cell>{result.x}</Cell>
				<Cell>{result.y}</Cell>
				<Cell>{result.r}</Cell>
				<Cell>{result.hit ? "Да" : "Нет"}</Cell>
				<Cell>{result.executionTime} нс</Cell>
			</Row>
		{/each}
	{/snippet}

	{#snippet pagination()}
		<Pagination bind:currentPage={currentPage} lastPage={lastPage} />
	{/snippet}
</Table>