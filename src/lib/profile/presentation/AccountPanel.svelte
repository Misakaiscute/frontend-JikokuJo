<script lang="ts">
    import UserController from "../userController.svelte.ts";
    import BlackScreenOverlay from "../../../core/presentation/BlackScreenOverlay.svelte";

    const userController: UserController = UserController.getUserControllerContext();

    const onPopupClose = () => { userController.popupShown = null }
</script>

{#snippet heading(title: string, onDismiss: () => void)}
    <div class="flex-[0_0_2rem] w-full flex justify-around items-center">
        <div class="flex-[1_1_auto] h-full flex justify-start items-center">
            <p>{title}</p>
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
{/snippet}

<BlackScreenOverlay onclick={onPopupClose}>
    <div role="dialog" tabindex="-1"
        class="h-[clamp(20rem,80svh,36rem)] w-[clamp(12rem,40svw,24rem)] rounded-md bg-white pointer-events-auto"
        onclick={(e) => e.stopPropagation()}
        onmousedown={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
    >
        <div class="h-full min-h-0 w-full py-1 px-2 flex flex-col items-start justify-start">
            {@render heading("Felhasználió fiók", () => onPopupClose())}

        </div>
    </div>
</BlackScreenOverlay>