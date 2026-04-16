<script lang="ts">
    interface Props {
        title: string,
        onDismiss: () => void
    }

    let { title, onDismiss }: Props = $props();
</script>
<div class="flex-[0_0_2rem] w-full p-3 flex justify-around items-center">
    <div class="flex-[1_1_auto] h-full flex justify-start items-center">
        <p class="text-zinc-600 font-medium uppercase">{title}</p>
    </div>
    <button aria-label="close-panel" id="close-btn"
        class="group flex-[0_0_1.8rem] aspect-square rounded-full bg-zinc-200 hover:bg-zinc-800 hover:cursor-pointer transition-colors duration-300"
        onclick={onDismiss} onkeydown={() => {}}
    >
        <svg class="stroke-zinc-800 group-hover:stroke-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    </button>
</div>