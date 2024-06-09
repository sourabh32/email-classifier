export const clasifyMerge = (emails,classification) =>{
    let map ={}
    for(const item  of classification){
        map[item.subject]  = item.classification;
    }
     console.log(map)
     return emails.map((email) => {
        if (map[email.subject]) {
        
            return { ...email, classification: map[email.subject] };
        } else {
           
            return { ...email, classification: 'Unclassified' }; // Ensure classification is always added
        }
    });
    

    
    
}