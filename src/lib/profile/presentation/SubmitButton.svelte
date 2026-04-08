<script lang="ts">
    let { text, onclick = (() => {}) }: { text: string, onclick?: () => void } = $props();
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    role="button" tabindex="-1"
    class="flex-[0_0_5rem] w-full mt-auto rounded-md flex justify-center items-center bg-zinc-200
        hover:bg-zinc-800 hover:text-white hover:cursor-pointer transition-colors duration-300"
    onclick={onclick}
><p class="text-lg">{text}</p></div>