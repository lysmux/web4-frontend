<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet,
		attr?: string,
		mdRow?: number,
		mdCol?: number,
		smRow?: number,
		smCol?: number,
	}

	const {
		children,
		attr,
		mdRow,
		mdCol,
		smRow,
		smCol,
	}: Props = $props();
</script>

<td
	data-label={attr}
	data-mdRow={mdRow}
	data-mdCol={mdCol}
	data-smRow={smRow}
	data-smCol={smCol}
>
	{@render children()}
</td>

<style lang="scss">
	td {
    padding: 10px;
    text-align: center;
    vertical-align: middle;
    height: 50px;
	}

	@media (max-width: 1000px) {
		td {
      display: block;
      text-align: right;
      font-size: 13px;

      border-bottom: 1px dotted #ccc;
      border-right: 1px dotted #ccc;
      align-content: center;

			&:before {
        content: attr(data-label);
        float: left;
        text-transform: uppercase;
        font-weight: bold;
        text-align: left;
      }
		}
  }

  @media (max-width: 1000px) and (min-width: 600px) {
    td {
      grid-row: attr(data-mdRow number);
      grid-column: attr(data-mdCol number);
    }

    td[data-mdRow="2"] {
      border-bottom: none;
    }
    td[data-mdCol="3"] {
      border-right: none;
    }
  }

  @media (max-width: 600px) {
    td {
      grid-row: attr(data-smRow number);
      grid-column: attr(data-smCol number);
    }

    td[data-smRow="3"] {
      border-bottom: none;
    }
    td[data-smCol="2"] {
      border-right: none;
    }
  }
</style>