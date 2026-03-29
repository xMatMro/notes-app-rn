import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
import * as React from 'react'

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView>
            
            <DrawerItemList/>

            <DrawerItem
                label="test"
                icon={() => <Image />}
                onPress={() => console.log("test")}
            />
           
        </DrawerContentScrollView>
    );
}

export default CustomDrawerContent