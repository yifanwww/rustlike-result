#[cfg(test)]
mod tests {
    #[test]
    fn test_result_equality() {
        let res1: Result<i32, &str> = Ok(10);
        let res2: Result<i32, &str> = Ok(10);
        let res3: Result<i32, &str> = Ok(20);
        let res4: Result<i32, &str> = Err("error");

        assert_eq!(res1, res2);
        assert_ne!(res1, res3);
        assert_ne!(res1, res4);
    }

    #[test]
    fn test_nested_result_equality() {
        let res1: Result<Result<i32, &str>, &str> = Ok(Ok(5));
        let res2: Result<Result<i32, &str>, &str> = Ok(Ok(5));
        let res3: Result<Result<i32, &str>, &str> = Ok(Err("inner error"));
        let res4: Result<Result<i32, &str>, &str> = Err("outer error");

        assert_eq!(res1, res2);
        assert_ne!(res1, res3);
        assert_ne!(res1, res4);
    }

    #[test]
    fn test_nan_result_equality() {
        let res1: Result<f64, &str> = Ok(f64::NAN);
        let res2: Result<f64, &str> = Ok(f64::NAN);

        assert_ne!(f64::NAN, f64::NAN);
        assert_ne!(res1, res2);
    }
}
