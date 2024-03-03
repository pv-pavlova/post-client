import { memo, useContext } from "react";
import { Link } from 'react-router-dom';
import * as classNames from "classnames";
import { MainListContext } from "./MainListContext";

export const AddButton = memo(({ className, ...props }) => {
    const context = useContext(MainListContext);
    return (
        <Link
            className={classNames(
                'text-white ml-3',
                'bg-blue-500',
                'p-2',
                'rounded-md',
                'hover:bg-blue-400',
                'active:bg-blue-700'
            )}
            to="/add-post"
            onClick={context?.onAddItem || props.onAddItem}
        >Добавить пост</Link>
    )
});