import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import axiosInstance from '../../axiosInstance'; // Adjust path as necessary
import tw from 'tailwind-react-native-classnames';

const TestScreen = ({ route }) => {
    const { subject, year, id } = route.params; // Get subject and year from route params
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axiosInstance.get('/questionslist', { params: { subject, year } });
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [subject, year]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post('/test-attempts', {
                userId: id,
                questions: Object.keys(answers).map(qId => {
                    const question = questions.find(q => q._id === qId);
                    return {
                        questionId: qId,
                        userAnswer: answers[qId],
                        isCorrect: question.correctAnswer === answers[qId], // Check if the answer is correct
                    };
                }),
            });
            setScore(response.data.score);
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    return (
        <View style={tw`flex-1 bg-white p-4`}>
            <Text style={tw`text-2xl font-bold text-center mb-4`}>
                Test for {subject} - Year {year}
            </Text>

            <FlatList
                data={questions}
                keyExtractor={(item) => item._id} // Assuming each question has a unique ID
                renderItem={({ item }) => (
                    <View style={tw`mb-4`}>
                        <Text style={tw`font-semibold`}>{item.questionText}</Text>
                        {item.options.map((option) => (
                            <TouchableOpacity
                                key={option._id} // Use unique ID for key
                                style={[
                                    tw`border border-gray-300 p-2 my-1`,
                                    answers[item._id] === option.optionText ? tw`bg-blue-200` : null // Change background color if selected
                                ]}
                                onPress={() => handleAnswerChange(item._id, option.optionText)}
                            >
                                <Text>{option.optionText}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            <Button title="Submit Test" onPress={handleSubmit} />

            {score !== null && (
                <Text style={tw`text-lg mt-4 text-center`}>
                    Your Score: {score}
                </Text>
            )}
        </View>
    );
};

export default TestScreen;
