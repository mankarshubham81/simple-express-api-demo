const express = require('express')
const Joi = require('joi');
const dotenv = require('dotenv');
const app = express();
const helmet = require('helmet');
var morgan = require('morgan')

dotenv.config();
const PORT = Number(process.env.PORT);

// Express Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
// helmet is third party middleware: Helps secure your apps by setting various HTTP headers.
app.use(helmet());
//Morgan is third party middleware: HTTP request logger.
app.use(morgan('tiny'));

const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"}
];

 // Define the schema
 const courseSchema = Joi.object({
    name: Joi.string().min(3).required()
});

app.get('/', (req, res) => { return res.status(200).json({message : 'Hello World!'})});


app.get('/api/courses', (req, res) => {
     return res.status(200).send(courses);
    })


    app.post('/api/courses', (req, res) => {
       
    
        // 2) Validate the request body against the schema
        // If Invalid, return 400 bad request
        // Note: we slso made validateCourse() function to make code more modular, but i still want this simple approach that is why I'm adding this note
        const { error, value } = courseSchema.validate(req.body);
    
        if (error) {
            return res.status(400).send({ msg: error.details[0].message });
        }
    
        // Create a new course
        const course = {
            id: courses.length + 1,
            name: value.name
        };
    
        console.log(course);
        courses.push(course);
    
        // Send response
        res.status(201).send(course);
    });

app.get('/api/courses/:id', (req,res,next) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(500).json({ message: "Course not founfd with this ID" });
    res.status(200).json(course);
})

app.put('/api/courses/:id', (req,res,next) => {

    // 1) Look up the course 
    // If not existing , return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).json({ message: "Course not founfd with this ID" });

    // 2) Validate the request body against the schema
    // If Invalid, return 400 bad request
    const { error, value } = validateCourse(req.body);
    // console.log(aa);
    if (error) {
        return res.status(400).send({ msg: error.details[0].message });
    }

    // 3) Update course
    // Return Updated course    
    if (course.id !== -1) {
        // courses[course.id - 1].name = value.name;
        // OR 
        course.name = value.name
    }
    // res.status(200).json(courses[course.id - 1]);
    // OR 
    res.status(200).json(course);
})

app.delete('/api/courses/:id', (req,res, next) => {
    // 1) Look up the course 
    // If not existing , return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).json({ message: "Course not founfd with this ID" });

    // 2) delete Course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // 3) return the same course
    res.send(course);
});

function validateCourse(course) {
    const courseSchema = Joi.object({
        name: Joi.string().min(3).required()
    });
 
    return courseSchema.validate(course);    
}

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));