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
			<Cell>Выполнение</Cell>
		</Row>
	{/snippet}

	{#snippet body()}
		{#each data as result (result.id)}
			<Row>
				<Cell
					attr="Время"
					mdRow={2} mdCol={1}
					smRow={1} smCol={1}
				>
					{new Date(result.createdAt).toLocaleTimeString()}
				</Cell>
				<Cell
					attr="X"
					mdRow={1} mdCol={1}
					smRow={2} smCol={1}
				>
					{result.x}
				</Cell>
				<Cell
					attr="Y"
					mdRow={1} mdCol={2}
					smRow={2} smCol={2}
				>
					{result.y}
				</Cell>
				<Cell
					attr="R"
					mdRow={1} mdCol={3}
					smRow={1} smCol={2}
				>
					{result.r}
				</Cell>
				<Cell
					attr="Попадание"
					mdRow={2} mdCol={2}
					smRow={3} smCol={1}
				>
					{result.hit ? "Да" : "Нет"}
				</Cell>
				<Cell
					attr="Выполнение"
					mdRow={2} mdCol={3}
					smRow={3} smCol={2}
				>
					{result.executionTime} мс
				</Cell>
			</Row>
		{/each}
	{/snippet}

	{#snippet pagination()}
		<Pagination bind:currentPage={currentPage} lastPage={lastPage} />
	{/snippet}
</Table>