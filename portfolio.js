window.addEventListener("DOMContentLoaded", (event) => {
  const copymark = document.querySelector("#copy");
  const now = (new Date());
  if (copymark) {
    copymark.setAttribute("datetime", now.toISOString());
    copymark.innerText = now.getFullYear();
  }

  
  const insertDataFromTemplate = ((dataSource, templateSource, DOMQuery) => {
    fetch(dataSource).then((dataFetchReply) => {
      if (dataFetchReply.status == 200) {
        dataFetchReply.json().then((skillsArray) => {
          console.log(`aus ${dataSource}`, skillsArray);
          if (Handlebars) {
            fetch(templateSource).then((templateFetchReply) => {
              if (templateFetchReply.status == 200) {
                templateFetchReply.text().then((hbtemplate) => {
                  const template = Handlebars.compile(hbtemplate);
                  const resultHTML = template(skillsArray)
                  //console.log(resultHTML);
                  const parentItem = document.querySelector(DOMQuery);
                  if (parentItem) {
                    parentItem.innerHTML = resultHTML;
                  }
  
                }).catch((fetchHandleBarsTemplateError) => {
                  console.log("Fehler bei Textumwandlung", fetchHandleBarsTemplateError);
                })
                
              } else {
                console.log("kein template gefunden");
              }
            }).catch((error) => {
              console.log("Fehler bei handlebartemplate",error);
            })
          } else {
            console.log("handlebars nicht definiert");
          }
        }).catch((jsonError) => {
          console.log("parsing fehler beim JSON", jsonError);
        });
      }
    }).catch((fetchSkillsError) => {
      console.log("Fetch-Fehler", fetchSkillsError)
    });
  })
  /* skill-fetch mockup */
  insertDataFromTemplate("./skills.json", "./skillcategories.handlebars","#skillform");
  /* jobs-fetch mockup */
  insertDataFromTemplate("./jobs.json","jobs.handlebars","#jobs");

  const toJSONButton = document.querySelector("#toJSON");
  if (toJSONButton) {
    toJSONButton.addEventListener("click", (event) => {
      const categories = [];
      const skillForm = document.querySelector("#skillform");
      if (skillForm) {
        const fieldSets = skillForm.querySelectorAll("fieldset");
        if (fieldSets) {
          fieldSets.forEach((aFieldSet) => {
            const category = {};
            category.skills = [];
            category.id = aFieldSet.id;
            const aLegend = aFieldSet.querySelector("legend");
            if (aLegend) {
              category.name = aLegend.innerText;
            }
            const inputs = aFieldSet.querySelectorAll('input[type="number"]');
            if (inputs) {
              inputs.forEach((anInput) => {
                const aSkill = {};
                aSkill.id = anInput.id;
                aSkill.value = anInput.value;
                const aLabel = anInput.nextElementSibling;
                if (aLabel) {
                  aSkill.name = aLabel.innerText;
                  aSkill.desc = aLabel.getAttribute("title");
                }
                category.skills.push(aSkill);
              });
            }
            categories.push(category);
          })
        }
      }
      console.log(categories);
      navigator.clipboard.writeText(JSON.stringify(categories));
      window.alert("Kopiert");
    });
  }
})