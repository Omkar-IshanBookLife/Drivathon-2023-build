<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { currentUser, pb } from "../pocketbase";
    import type { Campaign, CreatedUser, Message } from "../types";
    import Loader from "./Loader.svelte";
    import type { UnsubscribeFunc } from "pocketbase";

    export let id: string = "";
    let messages: Message[];
    let newMessage: string;
    let campaign: Campaign;

    let unsubscribe: UnsubscribeFunc;

    onMount(async () => {
        campaign = await pb.collection("campaigns").getOne<Campaign>(id);
        console.log(campaign);

        let messagesResponse = await pb
            .collection("messages")
            .getList<Message>(1, 100, {
                sort: "+created",
                expand: "user",
                filter: `campaign="${id}"`,
            });
        
        messages = messagesResponse.items.reverse()

        unsubscribe = await pb
            .collection("messages")
            .subscribe(
                "*",
                async ({
                    action,
                    record,
                }: {
                    action: string;
                    record: Message;
                }) => {
                    if (action === "create") {
                        const user = await pb
                            .collection("users")
                            .getOne<CreatedUser>(record.user);
                        const campaign = await pb
                            .collection("campaigns")
                            .getOne<Campaign>(record.campaign);
                        record.expand = { user, campaign };
                        messages = [record, ...messages];
                    }
                    if (action === "delete") {
                        messages = messages.filter((m) => m.id !== record.id);
                    }
                }
            );
    });

    onDestroy(() => {
        unsubscribe?.();
    });

    async function sendMessage() {
        if (newMessage !== "") {
            const data = {
                content: newMessage,
                user: $currentUser.id,
                campaign: id,
            };
            await pb.collection("messages").create(data);
            newMessage = "";
        }
    }
</script>

<main>
    {#if campaign && $currentUser}
        <h2 class="text-center">{campaign.title}</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, quis
            perspiciatis odio aperiam esse blanditiis, quisquam animi debitis
            dicta eaque tempora molestiae facilis eligendi vitae, in aspernatur.
            In, quam eaque.
        </p>
        <hr />
        <form on:submit|preventDefault class="mb-3">
            <div class="input-group mb-3">
                <div class="form-floating">
                    <input
                        type="text"
                        class="form-control"
                        id="floatingInput"
                        placeholder="Chat Message"
                        bind:value={newMessage}
                    />
                    <label for="floatingInput">Chat Message</label>
                </div>
                <button
                    class="btn btn-primary"
                    type="submit"
                    id="button-addon2"
                    on:click={sendMessage}
                    name="chat">Send <i class="fas fa-paper-plane" /></button
                >
            </div>
        </form>
        <ul class="list-group">
            {#if messages}
                {#if messages.length === 0}
                    <p class="text-center list-group-item">
                        No Messages Yet! Initiate Conversation Now
                    </p>
                {:else}
                    {#each messages as message}
                        <li
                            class="list-group-item"
                            style="text-align: {$currentUser.id === message.user
                                ? 'left'
                                : 'right'};"
                        >
                            <div class="d-flex flex-column">
                                <span>{message.content}</span>
                                <small class="text-wrap"
                                    >{message.expand.user?.name}
                                    {new Date(
                                        message.created
                                    ).toLocaleDateString()}</small
                                >
                            </div>
                        </li>
                    {/each}
                {/if}
            {:else}
                <Loader />
            {/if}
        </ul>
    {:else}
        <Loader />
    {/if}
</main>
