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
	data-mdrow={mdRow}
	data-mdcol={mdCol}
	data-smrow={smRow}
	data-smcol={smCol}
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
      grid-row: attr(data-mdrow number);
      grid-column: attr(data-mdcol number);
    }

    td[data-mdrow="2"] {
      border-bottom: none;
    }
    td[data-mdcol="3"] {
      border-right: none;
    }
  }

  @media (max-width: 600px) {
    td {
      grid-row: attr(data-smrow number);
      grid-column: attr(data-smcol number);
    }

    td[data-smrow="3"] {
      border-bottom: none;
    }
    td[data-smcol="2"] {
      border-right: none;
    }
  }
</style>