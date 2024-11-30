import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000)
    const fileName = `resume-${random}-${jobData?.candidate_id}`

    const {error:storageError} = await supabase.storage.from('resumes').upload(fileName, jobData?.resume)

    if(storageError){
        console.log("Error uploading resume:", storageError);
        return null;
    }


    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`


    const { data, error} = await supabase.from('applications').insert([
        {
            ...jobData,
            resume
        }
    ]).
    select()

    if(error){
    console.log("Error submitting application:", error);
    return null;
    }

    return data

}


export async function updateApplications(token, {job_id}, status) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("applications")
        .update({status})
        .eq("job_id", job_id)
        .select()

    if(error || data.length === 0){
    console.log("Error updating application status:", error);
    return null;
    }

    return data

}

export async function addNewJob(token, _, jobData) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("jobs")
        .insert([jobData])
        .select()

    if(error || data.length === 0){
    console.log("Error creating job:", error);
    return null;
    }

    return data

}

export async function getApplications(token, {user_id}) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("applications")
        .select("*, job:jobs(title, company:companies(name))")
        .eq("candidate_id", user_id)

    if(error){
    console.log("Error Fetching Application:", error);
    return null;
    }

    return data

}