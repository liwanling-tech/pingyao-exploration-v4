// Provider boundary: replacing this adapter does not give the provider access to the 3D scene.
// Future provider returns { mode, status, ask?, close? }; embed/SDK auth remains outside this demo.
export function createGuide({landmarkId,observationTheme},landmark){
 return {mode:'demo',status:'ready',context:{landmarkId,observationTheme},
   async ask(index){
    if(!Number.isInteger(index)||!landmark.qa[index])throw Error('This demo supports only the listed preset questions');
    const [question,answer]=landmark.qa[index];return {question,answer,kind:'preset'};
   },close(){}
 };
}
