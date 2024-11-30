import supabaseClient from "@/utils/supabase";

export async function getJobs(token, {location, company_id, searchQuery}) {
    const supabase = await supabaseClient(token);

    let query = supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved:saved_jobs!saved_jobs_job_id_fkey(id)") //, saved: saved_jobs(id)

    if(location){
        query  = query.eq("location", location)
    }
    
    if(company_id){
        query  = query.eq("company_id", company_id)
    }
    
    if(searchQuery){
        query  = query.ilike("title", `%${searchQuery}%`)
    }
    
    
    const { data, error} = await query;

    if(error){
        console.log("Error fetching jobs:", error);
        return null;
    }

    return data;
     
}

export async function saveJob(token, {alreadySaved}, saveData) {
    const supabase = await supabaseClient(token);

    if(alreadySaved){
        const { data, error:deleteError} = await supabase
                          .from("saved_jobs")
                          .delete()
                          .eq("job_id", saveData.job_id)

    if(deleteError){
    console.log("Error deleteting saved job:", deleteError);
    return null;
    }


    return data;                   

    }
    else{
        const { data, error:insertError} = await supabase
                          .from("saved_jobs")
                          .insert([saveData])
                          .select()

        if(insertError){
            console.log("Error inserting savedjob:", insertError);
            return null;
        }
                    
        return data;

    }

    
}

export async function getSingleJob(token, {job_id}) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("jobs")
        .select("*, company:companies(name, logo_url), applications:applications(*)")
        .eq("id", job_id)
        .single()

    if(error){
    console.log("Error fetching single job:", error);
    return null;
    }

    return data

}

export async function updateHiringStatus(token, {job_id}, isOpen) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("jobs")
        .update({isOpen})
        .eq("id", job_id)
        .select()

    if(error){
    console.log("Error updating job status:", error);
    return null;
    }

    return data

}

export async function getSavedJobs(token) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("saved_jobs")
        .select("*, job:jobs!saved_jobs_job_id_fkey(*, company:companies(name, logo_url))")

    if(error || data.length === 0){
    console.log("Error fetching saved jobs:", error);
    return null;
    }

    return data

}

export async function getMyJobs(token, {recruiter_id}) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("jobs")
        .select("*, company:companies(name, logo_url)")  
        .eq("recruiter_id", recruiter_id)

    if(error || data.length === 0){
    console.log("Error fetching  jobs:", error);
    return null;
    }

    return data

}

export async function deleteJob(token, {job_id}) {
    const supabase = await supabaseClient(token);

        const { data, error} = await supabase
        .from("jobs")
        .delete()
        .eq("id", job_id)
        .select()

    if(error || data.length === 0){
    console.log("Error deleting  job:", error);
    return null;
    }

    return data

}