import Button from '@/components/common/Button'
import { FaPlus, FaBars } from 'react-icons/fa'
import { useAppStore } from '@/stores'

export default function Menubar() {
    const { toggleDrawer } = useAppStore()
    return (
        <div>
            <div className="flex flex-row gap-2">
                <Button icon={<FaPlus />} variant="secondary" size="md">新建对话</Button>
                <Button icon={<FaBars />} variant="secondary" onClick={toggleDrawer} />
            </div>

        </div>
    )
}
