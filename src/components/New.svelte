<script lang="ts">
    import Editor from "@tinymce/tinymce-svelte";
    import { currentUser, pb } from "../pocketbase";
    import { navigate } from "svelte-navigator";

    let title = "";
    let description = "";
    let map = "";
    let files;

    let apiKey = "07ta0mphzcve2tzdylsnlh4sb1nra8wjvp698ab8k27d36ry";
    let conf = {
        height: 500,
        plugins: [
            "a11ychecker",
            "advlist",
            "advcode",
            "advtable",
            "autolink",
            "checklist",
            "export",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "powerpaste",
            "fullscreen",
            "formatpainter",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
        ],
        toolbar:
            "undo redo | a11ycheck casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist checklist outdent indent | removeformat | code table help",
    };

    async function submitCampaign() {
        let formData = new FormData();
        formData.append("image", files[0]);
        formData.append("map", map);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("votes", "0");
        formData.append("createdUser", $currentUser.id);
        await pb.collection("campaigns").create(formData)
        navigate("/drives", {replace: true})
    }
</script>

<main>
    <form on:submit|preventDefault>
        <div class="mb-3">
            <label for="titleFormControl" class="form-label">Title</label>
            <input
                type="text"
                class="form-control"
                id="titleFormControl"
                bind:value={title}
            />
        </div>
        <hr />
        <div class="mb-3">
            <p class="form-label">Description</p>
            <Editor {apiKey} {conf} bind:value={description} />
        </div>
        <hr />
        <div class="mb-3 d-flex align-items-center justify-content-between">
            <label for="#imageFileUpload" class="form-label">Photo:</label>
            <input
                type="file"
                name="image"
                id="imageFileUpload"
                class="btn btn-primary"
                bind:files
            />
        </div>
        <hr />
        <div class="mb-3">
            <label for="mapURlFOrmControl" class="form-label">Map URL</label>
            <input
                type="url"
                class="form-control"
                id="mapURlFOrmControl"
                bind:value={map}
            />
        </div>
        <button class="btn btn-primary" type="submit" on:click={submitCampaign}
            >Submit</button
        >
    </form>
</main>
