#[cfg(test)]
mod tests {
    #[test]
    fn it_result_to_json() -> serde_json::Result<()> {
        let result1: Result<i32, &str> = Ok(1);
        let result2: Result<i32, &str> = Err("Some error message");

        let json1 = serde_json::to_string(&result1)?;
        let json2 = serde_json::to_string(&result2)?;

        assert_eq!(json1.as_str(), "{\"Ok\":1}");
        assert_eq!(json2.as_str(), "{\"Err\":\"Some error message\"}");

        Ok(())
    }

    #[test]
    fn it_result_from_json() -> serde_json::Result<()> {
        let str1 = "{\"Ok\":1}";
        let str2 = "{\"Err\":\"Some error message\"}";

        let result1: Result<i32, &str> = serde_json::from_str(str1)?;
        let result2: Result<i32, &str> = serde_json::from_str(str2)?;

        assert_eq!(result1, Ok(1));
        assert_eq!(result2, Err("Some error message"));

        Ok(())
    }
}
