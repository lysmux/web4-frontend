<script lang="ts">
	import { z } from 'zod';
	import { range } from '$lib/utils/utils.js';

	import type { Coordinates } from '$lib/api/hit.js';

	import FormField from '../../components/forms/FormField.svelte';
	import Error from '../../components/forms/Error.svelte';
	import Button from '../../components/Button.svelte';
	import Input from '../../components/forms/Input.svelte';

	interface Props {
		coordinatesData: Partial<Coordinates>;
		onSubmit: () => Promise<void>;
		onClear: () => Promise<void>;
	}

	const {
		coordinatesData = $bindable(),
		onSubmit,
		onClear
	}: Props = $props();

	const schema = z.object({
		x: z.number('Выберите X')
			.min(-5, 'Должен быть \u2265 -5')
			.max(3, 'Должен быть \u2264 3'),
		y: z.preprocess(val => {
				if (typeof val !== 'string') return val;
				return parseFloat(val.replace(/,/g, '.'));
			},
			z.coerce.number('Выберите Y')
				.min(-3, 'Должен быть \u2265 -3')
				.max(5, 'Должен быть \u2264 5')
		),
		r: z.int('Выберите R')
			.min(1, 'Должен быть \u2265 1')
			.max(3, 'Должен быть \u2264 3')
	});
	const parsed = $derived.by(() => {
		return schema.safeParse(coordinatesData);
	});
	const isValid = $derived(parsed.success);
	const errors = $derived(parsed.success ? {} : parsed.error.flatten().fieldErrors);

	let isLoading = $state(false);

	const isLoadingWrap = (callback: () => Promise<void>) => {
		return async () => {
			isLoading = true;
			await callback();
			isLoading = false;
		}
	}
</script>

<form class="form" onsubmit={e => {e.preventDefault(); isLoadingWrap(onSubmit)()}}>
	<div class="fields">
		<div class="form-block">
			<FormField label="X">
				<div class="group">
					{#each range(-5, 3) as x (x)}
						<button
							type="button"
							class={["button", {selected: coordinatesData.x === x}]}
							onclick={() => coordinatesData.x=x}>{x}
						</button>
					{/each}
				</div>
				{#if errors.x}
					<Error>{errors.x?.[0]}</Error>
				{/if}
			</FormField>
		</div>

		<div class="form-block">
			<FormField label="R">
				<div class="group">
					{#each range(1, 3) as r (r)}
						<button
							type="button"
							class={["button", {selected: coordinatesData.r === r}]}
							onclick={() => coordinatesData.r=r}
						>{r}</button>
					{/each}
				</div>
				{#if errors.r}
					<Error>{errors.r?.[0]}</Error>
				{/if}
			</FormField>
		</div>

		<div class="form-block wide">
			<FormField id="y" label="Y">
				<Input
					id="y"
					error={errors.y?.[0]}
					maxlength={5}
					bind:value={coordinatesData.y}
				/>
			</FormField>
		</div>
	</div>

	<div class="buttons">
		<Button
			loading={isLoading}
			disabled={!isValid}
			type="submit"
			variant="action"
		>
			Проверить
		</Button>
		<Button
			loading={isLoading}
			type="button"
			variant="danger"
			onclick={isLoadingWrap(onClear)}
		>
			Очистить результаты
		</Button>
	</div>
</form>


<style lang="scss">
  .wide {
    grid-column-start: 1;
    grid-column-end: -1;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px;
    gap: 20px;
    width: 100%;

    .fields {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      width: 100%;

      @media screen and (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  }

  .group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
  }

  .button {
    width: 100%;
    height: 50px;
    position: relative;
    border: 2px solid rgba(255, 255, 255, 0.15);
    padding: 4px 11px;
    cursor: pointer;
    border-radius: 12px;
    transition: transform 0.3s ease,
    border-color 0.3s ease;
    font-size: 0.8em;

    &:hover {
      transform: translateY(-1px);
    }

    background: rgba(40, 55, 80, 0.4);
    color: white;

    &:hover {
      border-color: rgba(45, 60, 85, 0.5);
    }

    &.selected {
      background: linear-gradient(145deg, #3a2b9c, #5a4db9);
      border-color: #3a2b9c;
    }
  }
</style>