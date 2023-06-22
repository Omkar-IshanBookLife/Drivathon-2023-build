<script lang="ts">
    import { onMount } from "svelte";
    import { currentUser, pb } from "../pocketbase";

    export let id: string = "";

    let drive = {};
    let comments = [];
    let saved = false;
    let commentText = "";

    onMount(async () => {
        drive = await pb.collection("campaigns").getOne(id);

        let savedUser = [];
        savedUser = drive.savedUsers;
        let isSaved = savedUser.find((drive) => drive === $currentUser.id);

        if (isSaved) {
            saved = true;
        } else {
            saved = false;
        }
        comments = (
            await pb.collection("comments").getFullList({ expand: "user" })
        ).filter((comment) => comment.campaign === id);
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

    async function commentCampaign() {
        const data = {
            content: commentText,
            user: $currentUser.id,
            campaign: id
        }
        await pb.collection("comments").create(data)
        comments = (
            await pb.collection("comments").getFullList({ expand: "user" })
        ).filter((comment) => comment.campaign === id);
    }
</script>

<main>
    <img
        src="https://drivathon.pockethost.io/api/files/campaigns/{drive?.id}/{drive?.image}"
        alt={drive.title}
        class="img-fluid rounded mx-auto d-block mb-5 w-50"
    />
    <h3>{drive.title}</h3>
    <p>{@html drive?.description?.slice(0, 200) + "...."}</p>
    <div class="d-flex align-items-center justify-content-between">
        <p><b>Votes</b>: {drive.votes}</p>
        <div>
            <div class="btn-group">
                <button class="btn btn-success" on:click={likeCampaign}
                    >👍</button
                >
                <button class="btn btn-danger" on:click={dislikeCampaign}
                    >👎</button
                >
            </div>
            <div class="btn-group">
                <a
                    class="btn btn-primary"
                    href={drive.map}
                    target="_blank"
                    rel="noreferrer">Map</a
                >
                {#if $currentUser}
                    {#if saved}
                        <button class="btn btn-info" disabled>Saved</button>
                    {:else}
                        <button class="btn btn-info" on:click={saveCampaign}
                            >Save</button
                        >
                    {/if}
                {/if}
            </div>
        </div>
    </div>
    <hr />
    <div>
        {@html drive.description}
    </div>
    <hr />
    <div class="d-flex align-items center justify-content-between mb-2">
        <h3>Comments</h3>
        {#if $currentUser}
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">📩</button>
        {:else}
            <p class="text-muted">Please login or signup to comment</p>
        {/if}
    </div>
    <ul class="list-group">
        {#each comments as comment}
            <li
                class="list-group-item d-flex align-items-center justify-content-between"
            >
                <p>{comment.content}</p>
                <p class="text-muted">By {comment?.expand?.user?.name}</p>
            </li>
        {/each}
    </ul>   

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
                        <input type="text" name="comment" id="#commentInput" class="form-control" bind:value={commentText}>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button
                        >
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click={commentCampaign}
                            >Comment</button
                        >
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>
