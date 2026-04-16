<script lang="ts">
    import UserController from "../userController.svelte.ts";
    import InputField from "./InputField.svelte";
    import SubmitButton from "./SubmitButton.svelte";
    import BlackScreenOverlay from "../../../core/presentation/BlackScreenOverlay.svelte";
    import DialogHeader from "../DialogHeader.svelte";

    const userController: UserController = UserController.getUserControllerContext();
    userController.registerRequestResult = Promise.resolve(false);

    let firstName: string = $state("");
    let lastName: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    let passwordConfirmation: string = $state("");

    const onPopupClose = () => {
        userController.popupShown = null;
    }
</script>

{#snippet inputs()}
    <div class="flex-[0_0_4.25rem] mt-3 w-full flex justify-center items-center gap-x-1">
        <div class="flex-[1_1_auto] min-w-0 h-full flex flex-col justify-center items-start">
            <InputField bind:value={lastName} label="Vezetéknév" id="last-name" type="text" placeholder="Kis"/>
        </div>
        <div class="flex-[1_1_auto] min-w-0 h-full flex flex-col justify-center items-start">
            <InputField bind:value={firstName} label="Keresztnév" id="first-name" type="text" placeholder="Pista"/>
        </div>
    </div>
    <InputField bind:value={email} label="Email" id="email" type="text" placeholder="kispista@gmail.com"/>
    <InputField bind:value={password} label="Jelszó" id="password" type="password"/>
    <InputField bind:value={passwordConfirmation} label="Jelszó újra" id="password-confirm" type="password"/>
{/snippet}

<BlackScreenOverlay onclick={onPopupClose}>
    <div role="dialog" tabindex="-1"
        class="h-[clamp(20rem,80svh,36rem)] w-[clamp(16rem,40svw,24rem)] rounded-md bg-white pointer-events-auto"
        onclick={(e) => e.stopPropagation()}
        onmousedown={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
    >
        <div class="relative h-full min-h-0 w-full flex flex-col items-start justify-start">
            <DialogHeader title={"Regisztráció"} onDismiss={onPopupClose}/>
            {#await userController.registerRequestResult}
                <div class="flex-[1_1_auto] w-full px-2 flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    <span class="flex-[1_1_0]"></span>
                    <div class="absolute top-0 left-0 h-full w-full bg-zinc-900/80 rounded-sm flex justify-center items-center">
                        <span id="loader" class="flex-[0_0_50%] aspect-square"></span>
                    </div>
                </div>
                <SubmitButton text="Regisztráció"/>
            {:then isSuccessful}
                <div class="flex-[1_1_auto] w-full px-2 flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    {#if isSuccessful}
                        <p id="success-msg" class="flex-[0_0_auto] w-full my-3 px-1 text-green-800 break-all text-center">
                            Sikeres regisztráció!
                        </p>
                    {:else}
                        <span class="flex-[1_1_0]"></span>
                    {/if}
                </div>
                <SubmitButton text="Regisztráció" onclick={async () => {
                    await userController.attemptRegister(firstName, lastName, email, password, passwordConfirmation);
                }}/>
            {:catch err}
                <div class="flex-[1_1_auto] w-full px-2 flex flex-col items-start justify-start overflow-y-auto">
                    {@render inputs()}
                    <p id="error-msg" class="flex-[1_1_auto] w-full my-3 px-1 text-red-800 break-all text-center">
                        {err.message}
                    </p>
                </div>
                <SubmitButton text="Regisztráció" onclick={async () => {
                    await userController.attemptRegister(firstName, lastName, email, password, passwordConfirmation);
                }}/>
            {/await}
        </div>
    </div>
</BlackScreenOverlay>