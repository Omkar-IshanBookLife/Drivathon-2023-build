<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { currentUser, pb } from "../pocketbase";
    import { navigate } from "svelte-navigator";

    export let id: string = "";

    let drive = {};
    let comments = [];
    let updates = [];
    let saved = false;
    let commentText = "";
    let updateText = "";
    let savedUser = [];

    let unsubscribeComments: () => void;
    let unsubscribeUpdates: () => void;

    onMount(async () => {
        drive = await pb.collection("campaigns").getOne(id);

        if ($currentUser) {
            savedUser = drive.savedUsers;
            let isSaved = savedUser.find((drive) => drive === $currentUser.id);

            if (isSaved) {
                saved = true;
            } else {
                saved = false;
            }
        }

        comments = (
            await pb.collection("comments").getFullList({ expand: "user" })
        ).filter((comment) => comment.campaign === id);

        unsubscribeComments = await pb
            .collection("comments")
            .subscribe("*", async ({ action, record }) => {
                if (action === "create") {
                    const user = await pb
                        .collection("users")
                        .getOne(record.user);
                    record.expand = { user };
                    comments = [...comments, record];
                }
                if (action === "delete") {
                    comments = comments.filter((m) => m.id !== record.id);
                }
            });

        updates = (
            await pb.collection("updates").getFullList({ expand: "user" })
        ).filter((comment) => comment.campaign === id);

        unsubscribeUpdates = await pb
            .collection("updates")
            .subscribe("*", async ({ action, record }) => {
                if (action === "create") {
                    const user = await pb
                        .collection("users")
                        .getOne(record.user);
                    record.expand = { user };
                    updates = [...updates, record];
                }
                if (action === "delete") {
                    updates = updates.filter((m) => m.id !== record.id);
                }
            });
    });

    onDestroy(() => {
        unsubscribeComments?.();
        unsubscribeUpdates?.();
    });

    async function likeCampaign() {
        const data = {
            votes: (drive.votes + 1) as number,
        };
        drive.votes += 1;
        await pb.collection("campaigns").update(id, data);
    }

    async function dislikeCampaign() {
        const data = {
            votes: (drive.votes - 1) as number,
        };
        drive.votes -= 1;
        await pb.collection("campaigns").update(id, data);
    }

    async function saveCampaign() {
        let savedUsers = drive.savedUsers as [];
        savedUsers.push($currentUser.id);
        let data = {
            savedUsers,
        };
        await pb.collection("campaigns").update(id, data);
        saved = true;
    }

    async function removeCampaign() {
        let savedUsers = drive.savedUsers as any[];
        savedUsers = savedUsers.filter((user) => user !== $currentUser.id);
        await pb.collection("campaigns").update(id, { savedUsers: savedUsers });
        saved = false;
    }

    async function commentCampaign() {
        const data = {
            content: commentText,
            user: $currentUser.id,
            campaign: id,
        };
        await pb.collection("comments").create(data);
        comments = (
            await pb.collection("comments").getFullList({ expand: "user" })
        ).filter((comment) => comment.campaign === id);
    }

    async function updateCampaign() {
        const data = {
            content: updateText,
            user: $currentUser.id,
            campaign: id,
        };
        await pb.collection("updates").create(data);
        updates = (
            await pb.collection("updates").getFullList({ expand: "user" })
        ).filter((comment) => comment.campaign === id);
    }

    async function chatRoomPage() {
        navigate(`/chat/${id}`, { replace: true });
        window.location.reload();
    }
</script>

<main>
    <img
        src="https://drivathon.pockethost.io/api/files/campaigns/{drive?.id}/{drive?.image}"
        alt={drive.title}
        class="img-fluid rounded mx-auto d-block mb-5 vw-100"
    />
    <h3>{drive.title}</h3>
    <p>{@html drive?.description?.slice(0, 200) + "...."}</p>
    <div class="d-flex align-items-center justify-content-between">
        <h4><b>Votes</b>: {drive.votes}</h4>
        <div>
            <div class="btn-group me-2">
                <button class="btn btn-success" on:click={likeCampaign}
                    >👍</button
                >
                <button class="btn btn-danger" on:click={dislikeCampaign}
                    >👎</button
                >
            </div>
            <div class="btn-group me-2">
                <a
                    class="btn btn-primary"
                    href={drive.map}
                    target="_blank"
                    rel="noreferrer">Map</a
                >
                {#if $currentUser}
                    {#if saved}
                        <button class="btn btn-danger" on:click={removeCampaign}
                            >Remove</button
                        >
                    {:else}
                        <button class="btn btn-info" on:click={saveCampaign}
                            >Save</button
                        >
                    {/if}
                {/if}
            </div>
            {#if saved}
                <button class="btn btn-info" on:click={chatRoomPage}
                    >Chatroom</button
                >
            {/if}
        </div>
    </div>
    <hr />
    <div>
        {@html drive.description}
    </div>
    <hr />
    <br />
    <div class="d-flex align-items center justify-content-between mb-2">
        <h3>Comments</h3>
        {#if $currentUser}
            <button
                class="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal">📩</button
            >
        {:else}
            <p class="text-muted">Please login or signup to comment</p>
        {/if}
    </div>
    <ul class="list-group">
        {#if comments.length !== 0}
            {#each comments as comment}
                <li
                    class="list-group-item d-flex align-items-center justify-content-between"
                >
                    <p>{comment.content}</p>
                    <p class="text-muted">By {comment?.expand?.user?.name}</p>
                </li>
            {/each}
        {:else}
            <p class="text-center">No Comments Yet! Add One Now 💬</p>
        {/if}
    </ul>
    <hr />
    <br />

    <div class="d-flex align-items center justify-content-between mb-2">
        <h3>Updates</h3>
        {#if $currentUser}
            {#if $currentUser.id === drive.createdUser}
                <button
                    class="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#updateModal">📩</button
                >
            {/if}
        {/if}
    </div>
    <ul class="list-group">
        {#if updates.length !== 0}
            {#each updates as comment}
                <li
                    class="list-group-item d-flex align-items-center justify-content-between"
                >
                    <p>{comment.content}</p>
                    <p class="text-muted">By {comment?.expand?.user?.name}</p>
                </li>
            {/each}
        {:else}
            <p class="text-center">No Updates Yet! Please Wait ⌛</p>
        {/if}
    </ul>
    <hr />

    <div
        class="modal fade"
        id="updateModal"
        tabindex="-1"
        aria-labelledby="updateModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <form on:submit|preventDefault>
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="updateModalLabel">
                            Add an Update 🆕
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div class="modal-body">
                        <label for="#commentInput">Update</label>
                        <input
                            type="text"
                            name="comment"
                            id="#commentInput"
                            class="form-control"
                            bind:value={updateText}
                        />
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button
                        >
                        <button
                            type="button"
                            class="btn btn-success"
                            data-bs-dismiss="modal"
                            on:click={updateCampaign}>Update</button
                        >
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <form on:submit|preventDefault>
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Comment Form
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div class="modal-body">
                        <label for="#commentInput">Comment</label>
                        <input
                            type="text"
                            name="comment"
                            id="#commentInput"
                            class="form-control"
                            bind:value={commentText}
                        />
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button
                        >
                        <button
                            type="button"
                            class="btn btn-success"
                            data-bs-dismiss="modal"
                            on:click={commentCampaign}>Comment</button
                        >
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>
