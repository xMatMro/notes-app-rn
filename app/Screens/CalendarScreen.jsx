import { StyleSheet, Text, View, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import MyButton from '../components/MyButton';
import Note from '../components/Note';
import * as SecureStore from 'expo-secure-store';

LocaleConfig.locales['pl'] = {
    monthNames: [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ],
    monthNamesShort: [
        'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
        'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'
    ],
    dayNames: [
        'Niedziela', 'Poniedziałek', 'Wtorek',
        'Środa', 'Czwartek', 'Piątek', 'Sobota'
    ],
    dayNamesShort: [
        'Niedz.', 'Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.'
    ],
    today: "Dzisiaj"
};
LocaleConfig.defaultLocale = 'pl';

const CalendarScreen = ({ navigation }) => {
    const [allNotes, setAllNotes] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [dayNotes, setDayNotes] = useState([]);

    const buildMarkedDates = (notes, selected) => {
        const marked = notes.reduce((acc, note) => {
            acc[note.date] = { marked: true, dotColor: '#ff85de' };
            return acc;
        }, {});

        if (selected) {
            marked[selected] = {
                ...marked[selected],
                selected: true,
                selectedColor: '#00bafa',
                selectedTextColor: 'white',
                dotColor: '#ffffff'
            };
        }

        return marked;
    };

    const loadNotes = async () => {
        const temp = await SecureStore.getItemAsync('keys');
        const parsedKeys = temp ? JSON.parse(temp) : [];
        const keys = Array.isArray(parsedKeys) ? parsedKeys.filter(Boolean) : [];
        const notes = await Promise.all(keys.map(async title => {
            const raw = await SecureStore.getItemAsync(title);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return { title, ...parsed };
        }));
        const validNotes = notes.filter(Boolean);
        setAllNotes(validNotes);
        setMarkedDates(buildMarkedDates(validNotes, selectedDate));
        if (selectedDate) {
            setDayNotes(validNotes.filter(note => note.date === selectedDate));
        }
    };

    useEffect(() => {
        loadNotes();
        const unsubscribe = navigation.addListener('focus', loadNotes);
        return unsubscribe;
    }, [navigation, selectedDate]);

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setDayNotes(allNotes.filter(note => note.date === day.dateString));
        setMarkedDates(buildMarkedDates(allNotes, day.dateString));
    };

    const deleteNote = async (title) => {
        const temp = await SecureStore.getItemAsync('keys');
        if (!temp) return;
        const deleteTitles = JSON.parse(temp).filter(e => e !== title);
        await SecureStore.setItemAsync('keys', JSON.stringify(deleteTitles));
        await SecureStore.deleteItemAsync(title);
        const updatedNotes = allNotes.filter(note => note.title !== title);
        setAllNotes(updatedNotes);
        setDayNotes(prev => prev.filter(note => note.title !== title));
        setMarkedDates(buildMarkedDates(updatedNotes, selectedDate));
    };

    const confirmDelete = (title) => {
        Alert.alert('Usuń notatkę', 'Czy chcesz usunąć tę notatkę?', [
            { text: 'Anuluj', style: 'cancel' },
            { text: 'Usuń', style: 'destructive', onPress: () => deleteNote(title) }
        ]);
    };

    const getRandomDateLastWeek = () => {
        const randomDaysAgo = Math.floor(Math.random() * 7);
        const date = new Date();
        date.setDate(date.getDate() - randomDaysAgo);
        return {
            date: date.toISOString().split('T')[0],
            timestamp: date.getTime().toString(),
        };
    };

    const makeUniqueTitle = (base, existingKeys) => {
        let candidate = base;
        let suffix = 1;
        while (existingKeys.includes(candidate)) {
            candidate = `${base}-${suffix}`;
            suffix += 1;
        }
        return candidate;
    };

    const generateRandom = async () => {
        try {
            const temp = await SecureStore.getItemAsync('keys');
            const parsedKeys = temp ? JSON.parse(temp) : [];
            const keys = Array.isArray(parsedKeys) ? parsedKeys : [];

            const savePromises = [];

            for (let i = 0; i < 10; i++) {
                console.log(`Generuje notatkę ${i + 1}`);

                const { date, timestamp } = getRandomDateLastWeek();
                const baseTitle = `Losowa notatka_${i + 1}_${timestamp}`;
                let title = makeUniqueTitle(baseTitle, keys);
                title = title.replace(/\s+/g, '_')
                const noteObject = {
                    notes: `Przykładowa notatka stworzona automatycznie dla daty ${date}.`,
                    category: 0,
                    date,
                    timestamp,
                };

                keys.push(title);

                const promise = SecureStore.setItemAsync(title, JSON.stringify(noteObject));
                savePromises.push(promise);
            }

            console.log('Zapisywanie wszystkich notatek do pamięci...');

            await Promise.all(savePromises);

            await SecureStore.setItemAsync('keys', JSON.stringify(keys));

            await loadNotes();

        } catch (error) {
            console.error("Wystąpił błąd podczas generowania notatek:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kalendarz notatek</Text>
            <MyButton text={'Generuj losowe notatki'} background={'#ff85de'} textColor={'white'} fun={generateRandom} />
            <Calendar
                style={styles.calendar}
                onDayPress={handleDayPress}
                firstDay={1}
                markingType={'simple'}
                markedDates={markedDates}
            />
            <View style={styles.noteListHeader}>
                <Text style={styles.subTitle}>{selectedDate ? `Notatki z ${selectedDate}` : 'Wybierz dzień, aby zobaczyć notatki'}</Text>
                <Text style={styles.countText, { display: selectedDate ? 'block' : 'none' }}>{dayNotes.length} {dayNotes.length === 1 ? 'notatka' : 'notatek'}</Text>
            </View>
            {selectedDate && dayNotes.length === 0 && (
                <Text style={styles.emptyText}>Brak notatek dla wybranego dnia.</Text>
            )}
            <FlatList
                data={dayNotes}
                keyExtractor={item => item.title}
                contentContainerStyle={styles.flatList}
                renderItem={({ item }) => (
                    <Note title={item.title} navigation={navigation} onDelete={() => confirmDelete(item.title)} />
                )}
            />
        </View>
    )
}

export default CalendarScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fbff',
        padding: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1f2d5a',
        textAlign: 'center',
        marginBottom: 12,
    },
    calendar: {
        borderWidth: 1,
        borderColor: '#93d8ff',
        borderRadius: 18,
        backgroundColor: '#ffffff',
        marginBottom: 18,
        elevation: 2,
    },
    noteListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#273c75',
    },
    countText: {
        fontSize: 14,
        color: '#5d6b8a',
    },
    flatList: {
        paddingBottom: 20,
    },
    emptyText: {
        color: '#556171',
        fontSize: 15,
        textAlign: 'center',
        marginVertical: 12,
    },
})
