function PrePlayCard({title, buttonText, buttonLink}) {

    return (
        <div className ="text-center py-16 px-4 max-w-2x1 mx-auto"> 
            <h1 className="text-4xl md:text-5x1 font-bold text-gray-900 mb-6">
                {title}
            </h1>
            <a href={buttonLink} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                {buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" data-preply-ds-component=" " viewBox="0 0 24 24" aria-hidden="true" focusable="false" width={100} height={100}
                >
                <path fill-rule="evenodd" d="M16.086 10.993h-12v2h12l-5.293 5.293 1.414 1.414 7.707-7.707-7.707-7.707L10.793 5.7zm1 1" clip-rule="evenodd"></path>
                </svg>
            </a>
        </div>

    );
}

export default PrePlayCard;
