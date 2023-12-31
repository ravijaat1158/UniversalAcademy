import certificateModel from "../Models/certificateModel.js";
import inquiryModel from "../Models/inquiryModel.js";
import studentModel from "../Models/studentModel.js";
import jsontoken from "jsonwebtoken";
import fs from "fs";

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export const getReadInquiries = async (req, res) => {
  try {
    const data = await inquiryModel.find({ isRead: true });
    res.status(200).send({
      success: true,
      message: "Inquiries Getting Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in Getting Inquiries", error });
  }
};

export const getUnreadInquiries = async (req, res) => {
  try {
    const data = await inquiryModel.find({ isRead: false });
    res.status(200).send({
      success: true,
      message: "Inquiries Getting Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in Getting Inquiries", error });
  }
};

export const authController = async (req, res) => {
  try {
    const user = await studentModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    } else {
      return res.status(200).send({
        success: true,
        message: "User Authenticated",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Authentication Error", error });
  }
};

export const verifyAdminController = async (req, res) => {
  try {
    const { jwt } = req.body;
    const match = jsontoken.verify(jwt, process.env.JWT_SECRET);
    if (match) {
      const id = match._id;
      const admin = await studentModel.findById(id);

      res.status(200).send({
        success: true,
        message: "Admin Authenticated",
        admin: admin.isAdmin,
        verifiedStudent: admin.verified,
        userId:admin._id
      });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Admin Authenticated Error" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in Admin Verification" });
  }
};

export const markReadController = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = await inquiryModel.findByIdAndUpdate(_id, {
      isRead: true,
    });
    res.status(200).send({
      success: true,
      message: "Updated Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in Updating Inquiry", error });
  }
};

export const deleteReadController = async (req, res) => {
  try {
    const { _id } = req.params;
    await inquiryModel.findByIdAndDelete(_id);
    res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in Updating Inquiry", error });
  }
};

export const markAllReadCOntroller = async (req, res) => {
  try {
    await inquiryModel.updateMany({ isRead: false }, { isRead: true });
    res.send({ success: true, message: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const deleteAllReadCOntroller = async (req, res) => {
  try {
    await inquiryModel.deleteMany({ isRead: true });
    res.send({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const data = await studentModel.find({ verified: true }).sort({ name: 1 });
    res
      .status(200)
      .send({ success: true, message: "Students Getting Successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const addNewVerifiedStudentController = async (req, res) => {
  try {
    var { name, email, phone, gender, guardian, course , registration } = req.body;

    const existingEmail = await studentModel.findOne({ email });
    if (existingEmail) {
      if (existingEmail.verified === true) {
        return res
          .status(200)
          .send({ success: false, message: "Email Already Exists" });
      } else {
        await studentModel.findOneAndDelete({ email });
      }
    }

    name = capitalizeFirstLetter(name);
    guardian = capitalizeFirstLetter(guardian);
    var password;
    var verified = true;
    if (name.length >= 3) {
      password = name.slice(0, 4) + phone.slice(phone.length - 4);
    } else {
      password = name.slice(0) + phone.slice(phone.length - 4);
    }
    const student = new studentModel({
      name,
      phone,
      email,
      registration,
      gender,
      guardian,
      password,
      verified,
      course,
    });
    await student.save();
    res.status(200).send({ success: true, message: "Added Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in Adding Student", error });
  }
};

export const updateVerifiedStudentController = async (req, res) => {
  try {
    var { name, email, phone, gender, guardian, course, password } = req.body;
    const { id } = req.params;

    const existingEmail = await studentModel.findOne({ email });
    if (existingEmail) {
      if (existingEmail.verified === true) {
      } else {
        await studentModel.findOneAndDelete({ email });
      }
    }

    await studentModel.findByIdAndUpdate(id, {
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      course: course,
      guardian: guardian,
      password: password,
    });
    res.status(200).send({ success: true, message: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in Updating Student", error });
  }
};

export const getSingleStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await studentModel.findById(id);
    res
      .status(200)
      .send({ success: true, message: "Details GEtting Successfully", data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: true, message: "Error in getting Details", error });
  }
};

export const deleteSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await studentModel.findByIdAndDelete(id);
    res.status(202).send({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in deleting" });
  }
};

export const studentDetailsForCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentModel.findById(id);
    const data = {
      name: student.name,
      uid: student.registration,
      course: student.course,
    };
    res
      .status(200)
      .send({ success: true, message: "details Getting Successfully", data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "error in getting Student Details" });
  }
};

export const uploadCertificateController = async (req, res) => {
  try {
    const { photo } = req.files;
    const { certificateID, verificationLink, student, course } = req.fields;

    const c = new certificateModel({
      certificateID,
      verificationLink,
      student,
      course,
    });
    c.photo.data = fs.readFileSync(photo.path);
    c.photo.contentType = photo.type;
    await c.save();
    res.status(201).send({ success: true, message: "Uploaded Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in uploading" });
  }
};

export const getAllCertificatesController = async (req, res) => {
  try {
    const { id } = req.params;
    const certificates = await certificateModel
      .find({ student: id })
      .select("-photo");
    res.status(200).send({
      success: true,
      mesage: "Certificate Fetched Successfully",
      certificates,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in getting Certificate Image" });
  }
};

export const getCertificateImageBinaryData = async (req, res) => {
  try {
    const { id } = req.params;
    const certificates = await certificateModel.findOne({ certificateID: id });
    // res.send(certificates);
    res.set("Content-type", certificates.photo.contentType);
    return res.status(200).send(certificates.photo.data);
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in getting Certificate Image" });
  }
};

export const getUserByCertificateID = async (req, res) => {
  try {
    const id = req.params.id;

    const certificate = await certificateModel
      .findOne({ certificateID: id })
      .select("-photo");

    const student = await studentModel.findById(certificate.student);

    res.status(200).send({ success: true, student });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "eeror in getting student details" });
  }
};

export const deleteCertificateController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await certificateModel.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "Deleted Successfully" });
    
  } catch (error) {
    res.status(500).send({ success: false, message: 'Error in deleting' });
  }
}