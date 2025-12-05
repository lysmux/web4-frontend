<script lang="ts">
	import { toasts } from 'svelte-toasts';

	import apiClient from '$lib/api/api.ts';
	import type { Coordinates, HitResult } from '$lib/api/hit.ts';
	import type { ApiResponse, PaginatedResponse } from '$lib/api/types';

	import Plot from '../../components/Plot.svelte';
	import CheckForm from './CheckForm.svelte';
	import HitsTable from './HitsTable.svelte';

	let hitResults: Record<number, HitResult[]> = $state({});
	let resultsTotal = $state(0);

	let coordinatesData: Partial<Coordinates> = $state({});

	const perPage = $state(10);
	let currentPage = $state(0);

	const slice = $derived(hitResults[currentPage]);
	const lastPage = $derived(Math.max(Math.ceil(resultsTotal / perPage) - 1, 0));

	$effect(() => {
		if (hitResults[currentPage] !== undefined) return;

		// apiClient
		// 	.get<PaginatedResponse<HitResult[]>>('/hits/list?page=' + (currentPage + 1))
		// 	.then((response) => response.data)
		// 	.then((data) => data.data)
		// 	.then(data => {
		// 		hitResults[currentPage] = data.list;
		// 		resultsTotal = data.total;
		// 	})
	})

	const addHit = (hit: HitResult) => {
		currentPage = lastPage
		if (hitResults[currentPage].length >= perPage) {
			hitResults[currentPage + 1] = []
			currentPage++;
		}
		resultsTotal++;
		hitResults[currentPage].push(hit);
	}

	const checkHit = async (): Promise<void> => {
		const response = await apiClient.post<ApiResponse<HitResult>>('/hits/check', coordinatesData);
		addHit(response.data.data);
	};

	const checkHitFromPlot = async (x: number, y: number) => {
		if (coordinatesData.r === undefined) {
			toasts.add({
				title: `Невозможно обработать клик`,
				description: 'Выберите радиус',
				placement: 'top-right',
				duration: 6000,
				showProgress: true,
				type: 'error'
			});
			return;
		}

		const response = await apiClient.post<ApiResponse<HitResult>>('/hits/check', {
			x: x,
			y: y,
			r: coordinatesData.r
		});
		addHit(response.data.data);
	};

	const clearResults = async () => {
		await apiClient.post('/hits/clear')
		hitResults = {[currentPage]: []}; // чтобы не было запроса на получение результатов первой страницы
		currentPage = 0;
		resultsTotal = 0;
	};
</script>
<div class="container">
	<div class="block">
		<Plot
			onClick={checkHitFromPlot}
			hitResults={slice}
			radius={coordinatesData.r}
		/>
	</div>
	<div class="block">
		<CheckForm
			bind:coordinatesData
			onSubmit={checkHit}
			onClear={clearResults}
		/>
	</div>
	<div class="block wide" style="height: 450px;">
		<HitsTable
			data={slice}
			bind:currentPage={currentPage}
			lastPage={lastPage}
		/>
	</div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px;

    @media (max-width: 1096px) {
      grid-template-columns: 1fr;
    }
  }

  .wide {
    grid-column-start: 1;
    grid-column-end: -1;
  }

  .block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 20px;
    background-color: var(--cardColor);
    border-radius: 16px;
    padding: 12px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>