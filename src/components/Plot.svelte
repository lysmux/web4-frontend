<script lang="ts">
	import { onMount } from 'svelte';
	import PlotDrawer from '$lib/plot/plotDrawer.ts';
	import { Point } from '$lib/plot/shape.ts';
	import type { HitResult } from '$lib/api/hit.ts';
	import { round } from '$lib/utils/math.ts';
	import { devicePixelRatio} from 'svelte/reactivity/window';


	interface Props {
		radius: number | undefined;
		hitResults?: HitResult[];
		onClick?: (x: number, y: number) => void;
	}

	const {
		radius = undefined,
		hitResults = [],
		onClick
	}: Props = $props();


	let wrapper: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	let drawer: PlotDrawer | null = $state(null);


	onMount(() => {
		const resizeCanvas = () => {
			const { width, height } = wrapper.getBoundingClientRect();

			canvas.width = Math.floor(width * devicePixelRatio.current);
			canvas.height = Math.floor(height * devicePixelRatio.current);

			drawer?.update();
		};

		drawer = new PlotDrawer(canvas, radius);

		resizeCanvas();

		window.addEventListener('resize', resizeCanvas);
	});

	$effect(() => {
		drawer?.setRadius(radius);
		drawer?.update();
	});

	$effect(() => {
		drawer?.setCustomShapes(hitResults.map(r => {
			return new Point(
				{ x: r.x, y: r.y },
				0.025,
				true,
				r.hit ? 'green' : 'red'
			);
		}));
		drawer?.update();
	});

	const handleClick = (e: MouseEvent) => {
		const rect = canvas.getBoundingClientRect();
		const canvasX = e.clientX - rect.left;
		const canvasY = e.clientY - rect.top;

		const x = ((canvasX - rect.width / 2) / drawer.options.step / 4) * radius;
		const y = (-(canvasY - rect.height / 2) / drawer.options.step / 4) * radius;

		onClick?.(round(x,  3), round(y,  3));
	};
</script>

<div bind:this={wrapper} class="wrapper">
	<canvas bind:this={canvas} onclick={handleClick}></canvas>
</div>

<style lang="scss">
  .wrapper {
    width: 100%;
		height: 100%;
		aspect-ratio: 16/9;

    canvas {
			height: 100%;
			width: 100%;
      background-color: #fff;
    }
  }
</style>