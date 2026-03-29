import { type SongSelection } from "../../types/sharedTypes"

export function SongContainer({ deezerId, title, artist, albumArt, preview}: SongSelection ) {

    return (
        <main className="w-full flex">
            <div className="relative w-40 h-40">
                {/* Image container */}
                <img 
                    src={albumArt} 
                    alt="Album cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 flex-col text-black">
                    <p>{title}</p>
                    <p>{artist}</p>
                </div>
            </div>
            <div>
                <p>Rest of the content goes here.</p>
            </div>
        </main>
    )
}