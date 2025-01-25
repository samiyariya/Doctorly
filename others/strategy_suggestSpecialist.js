// Strategy interface for suggesting specialists based on symptoms
class SpecialistRecommendationStrategy {
    recommendSpecialists(description) {
        throw new Error("You must implement the recommendSpecialists method!");
    }
}

// Dermatology strategy
class DermatologyRecommendation extends SpecialistRecommendationStrategy {
    recommendSpecialists(description) {
        const dermatologyKeywords = [
            "skin", "face", "hair", "nails", "rash", "red rash", "itchy skin", "dry skin", 
            "pigmentation", "hair fall", "nail problems", "eczema", "acne", "psoriasis", "itching"
        ];
        const priorityMap = {
            "skin": 3, "face": 3, "hair": 3, "nails": 3, "rash": 2, "red rash": 2, 
            "itchy skin": 2, "dry skin": 3, "pigmentation": 3, "hair fall": 3, 
            "nail problems": 3, "eczema": 2, "acne": 2, "psoriasis": 2, "itching": 2
        };
        
        return this._findMatchingSpecialists(description, dermatologyKeywords, priorityMap, "Dermatologist");
    }

    _findMatchingSpecialists(description, keywords, priorityMap, specialist) {
        const matchedSpecialists = {};
        keywords.forEach(keyword => {
            if (description.toLowerCase().includes(keyword)) {
                matchedSpecialists[specialist] = Math.min(matchedSpecialists[specialist] || Infinity, priorityMap[keyword]);
            }
        });
        return matchedSpecialists;
    }
}

// Neurology strategy
class NeurologyRecommendation extends SpecialistRecommendationStrategy {
    recommendSpecialists(description) {
        const neurologyKeywords = [
            "headache", "severe headache", "migraine pain", "chronic headache", "dizziness", 
            "loss of memory", "stroke", "tremors", "paralysis", "numbness", "seizure", "epilepsy"
        ];
        const priorityMap = {
            "headache": 2, "severe headache": 1, "migraine pain": 1, "chronic headache": 1, 
            "dizziness": 1, "loss of memory": 1, "stroke": 1, "tremors": 2, "paralysis": 1, 
            "numbness": 2, "seizure": 1, "epilepsy": 1
        };

        return this._findMatchingSpecialists(description, neurologyKeywords, priorityMap, "Neurologist");
    }

    _findMatchingSpecialists(description, keywords, priorityMap, specialist) {
        const matchedSpecialists = {};
        keywords.forEach(keyword => {
            if (description.toLowerCase().includes(keyword)) {
                matchedSpecialists[specialist] = Math.min(matchedSpecialists[specialist] || Infinity, priorityMap[keyword]);
            }
        });
        return matchedSpecialists;
    }
}

// Similarly, you can add other strategies for Gastroenterologist, Pediatrician, etc.



class SpecialistContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    // Set the strategy
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    // Use the current strategy to recommend specialists
    recommendSpecialists(description) {
        return this.strategy.recommendSpecialists(description);
    }
}


const suggestSpecialist = async (req, res) => {
    try {
        const { description } = req.body; // User's health description

        if (!description) {
            return res.json({
                success: false,
                message: "Please provide a health description",
            });
        }

        // Create the context and set the initial strategy
        const context = new SpecialistContext(new DermatologyRecommendation()); // Starting with Dermatology strategy

        // Depending on the symptoms, switch strategies (you could add logic to choose the correct strategy)
        let result = context.recommendSpecialists(description);

        // Check if the dermatology strategy gave results, if not, switch strategy to Neurology, etc.
        if (Object.keys(result).length === 0) {
            context.setStrategy(new NeurologyRecommendation());
            result = context.recommendSpecialists(description);
        }

        // Similarly, you can switch between different strategies (Gastroenterology, Pediatrician, etc.)

        // Sort specialists by priority and send response
        const sortedSpecialists = Object.entries(result)
            .sort((a, b) => a[1] - b[1])
            .map(([specialist]) => specialist);

        if (sortedSpecialists.length === 0) {
            return res.json({
                success: true,
                specialists: ["General Physician"],
                message:
                    "Your symptoms are general. Please consult a General Physician to begin with.",
            });
        } else {
            return res.json({
                success: true,
                specialists: sortedSpecialists,
                message: "Based on your description, you should visit the recommended specialists.",
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


