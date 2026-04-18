<script lang="ts">
    interface Props {
        text: string,
        onclick?: () => void,
    }

    let { text, onclick = (() => {}) }: Props = $props();
</script>
<div id="submit" role="button" tabindex="0"
    class="flex-[0_0_4.2rem] w-full mt-2 rounded-b-sm flex justify-center items-center bg-zinc-200
        hover:bg-zinc-800 hover:text-white hover:cursor-pointer transition-colors duration-300"
    onclick={onclick} onkeydown={() => {}}
><p class="text-lg">{text}</p></div>