<script lang="ts">
    import {fade} from "svelte/transition";
    import UserController from "./userController.svelte.ts";
    import InputField from "./InputField.svelte";
    import SubmitButton from "./SubmitButton.svelte";

    const userController: UserController = UserController.getUserControllerContext();
    userController.loginRequestResult = Promise.resolve(false);

    let firstName: string = $state("");
    let lastName: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    let passwordConfirmation: string = $state("");
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div transition:fade={{duration: 200}}
    role="button" tabindex="-1"
    class="z-50 absolute top-0 left-0 h-svh w-svw bg-zinc-900/80 flex flex-col justify-center items-center pointer-events-auto"
    onclick={() => {
        userController.popupShown = null;
    }}
>
    <div
        role="button" tabindex="-1"
        class="h-[clamp(20rem,80svh,36rem)] w-[clamp(12rem,40svw,24rem)] rounded-t-md rounded-b-lg bg-white flex flex-col justify-start items-start pointer-events-auto"
        onclick={(e) => e.stopPropagation()}
    >
        <div class="flex-[1_1_auto] w-full py-1 px-2 flex flex-col items-start justify-start">
            <div class="flex-[0_0_2rem] w-full flex justify-around items-center">
                <div class="flex-[1_1_auto] h-full flex justify-start items-center">
                    <p>Regisztráció</p>
                </div>
                <button
                    aria-label="close-panel"
                    class="group flex-[0_0_1.8rem] aspect-square rounded-full bg-zinc-200 hover:bg-zinc-800 hover:cursor-pointer transition-colors duration-300"
                    onclick={() => {
                        userController.popupShown = null;
                    }}
                >
                    <svg class="stroke-zinc-800 group-hover:stroke-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            {#await userController.registerRequestResult}
                <div class="relative flex-[1_1_auto] w-full flex flex-col items-start justify-center">
                    {@render inputs()}
                    <SubmitButton text="Regisztráció"/>
                    <div class="absolute top-0 left-0 h-full w-full bg-zinc-900/80 rounded-sm flex justify-center items-center">
                        <span id="loader" class="flex-[0_0_50%] aspect-square"></span>
                    </div>
                </div>
            {:then isSuccessful}
                {@render inputs()}
                {#if isSuccessful}
                    <p id="success-msg" class="flex-[0_0_auto] w-full mt-3 px-1 text-green-800 break-all text-center">Sikeres regisztráció!</p>
                {/if}
                <SubmitButton text="Regisztráció" onclick={async () => {
                    await userController.attemptRegister(firstName, lastName, email, password, passwordConfirmation);
                }}/>
            {:catch err}
                {@render inputs()}
                <p id="error-msg" class="flex-[0_0_auto] w-full mt-3 px-1 text-red-800 break-all text-center">{err.message}</p>
                <SubmitButton text="Regisztráció" onclick={async () => {
                    await userController.attemptRegister(firstName, lastName, email, password, passwordConfirmation);
                }}/>
            {/await}
        </div>
    </div>
</div>