<script lang="ts">
    import UserController from "../userController.svelte.ts";
    import InputField from "./InputField.svelte";
    import SubmitButton from "./SubmitButton.svelte";
    import BlackScreenOverlay from "../../../core/presentation/BlackScreenOverlay.svelte";
    import DialogHeader from "../DialogHeader.svelte";

    const userController: UserController = UserController.getUserControllerContext();
    userController.loginRequestResult = Promise.resolve(false);

    let email: string = $state("");
    let password: string = $state("");
    let rememberMe: boolean = $state(false);

    $effect(() => {
        userController.loginRequestResult.then((success: boolean) => {
            if (success) userController.popupShown = null;
        }).catch(() => {});
    });

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
        class="h-[clamp(20rem,80svh,36rem)] w-[clamp(16rem,40svw,24rem)] rounded-md bg-white pointer-events-auto"
        onclick={(e) => e.stopPropagation()}
        onmousedown={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
    >
        <div class="relative h-full min-h-0 w-full flex flex-col items-start justify-start">
            <DialogHeader title={"Bejelentkezés"} onDismiss={onPopupClose}/>
            {#await userController.loginRequestResult}
                <div class="flex-[1_1_auto] w-full px-2 flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    <span class="flex-[1_1_0]"></span>
                    <div class="absolute top-0 left-0 h-full w-full bg-zinc-900/80 rounded-sm flex justify-center items-center">
                        <span id="loader" class="flex-[0_0_50%] aspect-square"></span>
                    </div>
                </div>
                <SubmitButton text="Bejelentkezés"/>
            {:then isSuccessful}
                <div class="flex-[1_1_auto] w-full px-2 flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    {#if isSuccessful}
                        <p id="success-msg" class="flex-[0_0_auto] w-full mt-3 px-1 text-green-800 break-all text-center">
                            Sikeres bejelentkezés!
                        </p>
                    {:else}
                        <span class="flex-[1_1_0]"></span>
                    {/if}
                </div>
                <SubmitButton text="Bejelentkezés" onclick={async () => {
                    await userController.attemptLogin(email, password, rememberMe);
                }}/>
            {:catch err}
                <div class="flex-[1_1_auto] w-full px-2 flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    <p id="error-msg" class="flex-[0_0_auto] w-full mt-3 px-1 text-red-800 break-all text-center">
                        {err.message}
                    </p>
                </div>
                <SubmitButton text="Bejelentkezés" onclick={async () => {
                    userController.attemptLogin(email, password, rememberMe);
                }}/>
            {/await}
        </div>
    </div>
</BlackScreenOverlay>