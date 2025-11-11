import ModalSelect from './ModalSelect'
import RecommendedSearch from './RecommendedSearch'

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-8">
            <ModalSelect />
            <RecommendedSearch />
        </div>
    )
}
