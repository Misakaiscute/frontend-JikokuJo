<script lang="ts">
    import {fade} from "svelte/transition";
    import type {Snippet} from "svelte";

    interface Props {
        children: Snippet | null,
        onclick?: () => void,
    }

    let { children, onclick = () => {}}: Props = $props();
</script>
<div transition:fade={{ duration: 200 }} role="presentation" tabindex="-1"
    class="z-50 fixed top-0 left-0 h-svh w-svw flex justify-center items-center bg-zinc-950/80 pointer-events-auto"
    onmousedown={onclick}
    onkeyup={() => {}}
>
    {@render children?.()}
</div>