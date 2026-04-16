<script lang="ts">
    import UserController from "./userController.svelte.ts";
    import InputField from "./InputField.svelte";
    import SubmitButton from "./SubmitButton.svelte";
    import BlackScreenOverlay from "../../core/presentation/BlackScreenOverlay.svelte";

    const userController: UserController = UserController.getUserControllerContext();
    userController.loginRequestResult = Promise.resolve(false);

    let email: string = $state("");
    let password: string = $state("");
    let rememberMe: boolean = $state(false);

    const onPopupClose = () => {
        userController.popupShown = null;
    }
</script>
{#snippet inputs()}
    <InputField bind:value={email} label="Email" id="email" type="text" placeholder="kispista@gmail.com"/>
    <InputField bind:value={password} label="Jelszó" id="password" type="password"/>
    <label class="text-sm mt-3 mb-0.5 pl-1">
        <input type="checkbox" bind:checked={rememberMe} class="translate-y-0.5">
        Emlékezz rám
    </label>
{/snippet}

<BlackScreenOverlay onclick={onPopupClose}>
    <div role="dialog" tabindex="-1"
        class="h-[clamp(20rem,80svh,36rem)] w-[clamp(12rem,40svw,24rem)] rounded-t-md rounded-b-lg bg-white flex flex-col pointer-events-auto"
        onclick={(e) => e.stopPropagation()}
        onmousedown={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
    >
        <div class="flex-[1_1_auto] min-h-0 w-full py-1 px-2 flex flex-col items-start justify-start">
            <div class="flex-[0_0_2rem] w-full flex justify-around items-center">
                <div class="flex-[1_1_auto] h-full flex justify-start items-center">
                    <p>Bejelentkezés</p>
                </div>
                <button aria-label="close-panel" id="close-btn"
                    class="group flex-[0_0_1.8rem] aspect-square rounded-full bg-zinc-200 hover:bg-zinc-800 hover:cursor-pointer transition-colors duration-300"
                    onmouseup={onPopupClose} onkeydown={() => {}}
                >
                    <svg class="stroke-zinc-800 group-hover:stroke-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            {#await userController.loginRequestResult}
                <div class="relative flex-[1_1_auto] w-full flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    <SubmitButton text="Bejelentkezés"/>
                    <div class="absolute top-0 left-0 h-full w-full bg-zinc-900/80 rounded-sm flex justify-center items-center">
                        <span id="loader" class="flex-[0_0_50%] aspect-square"></span>
                    </div>
                </div>
            {:then isSuccessful}
                <div class="flex-[1_1_auto] w-full flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    {#if isSuccessful}
                        <p id="success-msg" class="flex-[0_0_auto] w-full mt-3 px-1 text-green-800 break-all text-center">
                            Sikeres bejelentkezés!
                        </p>
                    {/if}
                </div>
                <SubmitButton text="Bejelentkezés" onclick={async () => {
                    await userController.attemptLogin(email, password, rememberMe);
                }}/>
            {:catch err}
                <div class="flex-[1_1_auto] w-full flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    <p id="error-msg" class="flex-[0_0_auto] w-full mt-3 px-1 text-red-800 break-all text-center">
                        {err.message}
                    </p>
                </div>
                <SubmitButton text="Bejelentkezés" onclick={async () => { await userController.attemptLogin(email, password, rememberMe)}}/>
            {/await}
        </div>
    </div>
</BlackScreenOverlay>