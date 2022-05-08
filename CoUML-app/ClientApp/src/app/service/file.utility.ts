
export namespace FileUtility {
	export function read(file: File): Promise<string>
	{
		return new Promise<string>((resolve, reject)=>{
			let fileReader = new FileReader();
			fileReader.onload = (e) => {
				console.log(
					"reading file\n\n",
					fileReader.result
				);
				resolve(fileReader.result.toString());
			}
			fileReader.readAsText(file);
		});
	}

}
